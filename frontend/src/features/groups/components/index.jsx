import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateGroup from "@groups/components/add-update-group";
import { useMemo } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ViewIcon from "@mui/icons-material/Visibility";
import MuiDataTable from "@components/table/mui-data-table";
import { useIsDesktop } from "@hooks/use-is-desktop";
import useModal from "@components/modal/use-modal";
import { GET_GROUPS, READ_GROUP, READ_GROUPS } from "@groups/graphql/queries";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { useGroup } from "@groups/hooks/use-group";
import { enqueueSnackbar } from "notistack";
import { parseGraphqlData } from "@utils/form";
import { useApolloQuery } from "@hooks/useApolloQuery";

const columnDefs = [
  {
    name: "id",
    label: "Id",
    options: {
      display: false,
      filter: false,
      sort: false,
      viewColumns: false,
    },
  },
  {
    name: "name",
    label: "Group Name",
  },
  {
    name: "groupType.type",
    label: "Group Type",
  },
  {
    name: "address.street",
    label: "Street",
  },
  {
    name: "address.suburb",
    label: "Suburb",
  },
  {
    name: "address.postCode",
    label: "Post Code",
  },
];

// TODO: Refactor to use for all table entity deletes
const onGroupsDelete = async (deletedRows, groups, deleteGroups, restoreGroups, cache) => {
  const deletedValues = deletedRows?.data.reduce((deletedValues, { dataIndex }) => {
    return { ...deletedValues, [groups[dataIndex].id]: groups[dataIndex].name };
  }, {});

  const deletedIds = Object.keys(deletedValues);

  try {
    const { ok, deletedCount } = await deleteGroups({
      variables: { groupIds: deletedIds },
      optimisticResponse: {
        deleteGroups: {
          ok: true,
          deletedCount: deletedIds.length,
          deletedIds,
        },
      },
    });

    if (!ok) {
      throw new Error("Oops! Something went wrong");
    }

    enqueueSnackbar(`${deletedCount} group(s) archived`, {
      variant: "undo",
      action: () => {
        restoreGroups({
          variables: { groupIds: deletedIds },
          optimisticResponse: {
            restoreGroups: [...cache.read(READ_GROUPS, { groupIds: deletedIds })],
          },
        });
      },
      onClose: () => {
        // Purge cache of deletedIds
        deletedIds.forEach((deletedId) => {
          cache.evict(`Group:${deletedId}`);
        });
      },
    });

    return ok;
  } catch (error) {
    enqueueSnackbar("Oops! Something went wrong", {
      variant: "retry",
      action: () => {
        // Retry delete mutation
        onGroupsDelete(deletedRows, groups, deleteGroups);
      },
    });
    return false;
  }
};

const Groups = () => {
  const { container } = useOutletContext();
  const { open: openAddEditGroup, Modal: AddUpdateGroupModal } = useModal();
  const isDesktop = useIsDesktop();
  const cache = useApolloCache();

  const { data: groups, loading, serverErrors, refetch } = useApolloQuery(GET_GROUPS);

  const { deleteGroups, restoreGroups } = useGroup();

  const actions = useMemo(
    () => ({
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <IconButton
              onClick={() => {
                const group = cache.read(READ_GROUP, { groupId: tableMeta.rowData[0] });
                openAddEditGroup({
                  group: parseGraphqlData(group, ["groupType"]),
                  groupName: group.name,
                });
              }}
            >
              <ViewIcon />
            </IconButton>
          );
        },
      },
    }),
    [openAddEditGroup, cache]
  );

  const columns = useMemo(() => [...columnDefs, actions], [actions]);

  const options = {
    filterType: "dropdown",
    enableNestedDataAccess: ".",
    responsive: "vertical",
    sortOrder: {
      name: "name",
      direction: "asc",
    },
    onRowsDelete: async (deletedRows) => {
      onGroupsDelete(deletedRows, groups, deleteGroups, restoreGroups, cache);
    },
  };

  return (
    <Box
      flexGrow={1}
      display="flex"
      flexDirection="column"
      gap="1rem"
      overflow="hidden"
      {...(!isDesktop && { paddingTop: "0.5rem" })}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" px="10px">
        <Header title="Groups" />
        <Fab color="secondary" onClick={openAddEditGroup}>
          <AddIcon />
        </Fab>
      </Box>
      <Box display="flex" flexGrow={1} overflow="hidden">
        <MuiDataTable
          title="View, Update or Add new groups"
          data={groups}
          columns={columns}
          options={options}
          loading={loading}
          retry={refetch}
          error={serverErrors?.networkError || serverErrors?.serverError}
        />
      </Box>
      <AddUpdateGroupModal modalProps={{ container: container.current }}>
        <AddUpdateGroup />
      </AddUpdateGroupModal>
    </Box>
  );
};

export default Groups;
