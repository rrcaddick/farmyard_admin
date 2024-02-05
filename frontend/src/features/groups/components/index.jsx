import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateGroup from "@groups/components/add-update-group";
import { useCallback, useMemo } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ViewIcon from "@mui/icons-material/Visibility";
import { useIsDesktop } from "@hooks/use-is-desktop";
import useModal from "@components/modal/use-modal";
import { GET_GROUPS, READ_GROUP, READ_GROUPS } from "@groups/graphql/queries";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { useGroup } from "@groups/hooks/use-group";
import { parseGraphqlData } from "@utils/form";
import { useApolloQuery } from "@hooks/use-apollo-query";
import { useMuiDataTable } from "@components/table/mui-data-table/use-mui-data-table";

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

const Groups = () => {
  const { container } = useOutletContext();
  const { open: openAddEditGroup, Modal: AddUpdateGroupModal } = useModal();
  const isDesktop = useIsDesktop();
  const cache = useApolloCache();

  const { data: groups, loading, serverErrors, refetch } = useApolloQuery(GET_GROUPS);

  const { deleteGroups, restoreGroups } = useGroup();

  const { MuiDataTable, onRowsDelete } = useMuiDataTable();

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
                const { price: { id } = {}, ...groupType } = group.groupType;
                openAddEditGroup({
                  group: parseGraphqlData({ ...group, groupType: { ...groupType, price: id } }, ["groupType"]),
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

  const deleteAction = useCallback(
    async (deletedIds) => {
      return await deleteGroups({
        variables: { groupIds: deletedIds },
        optimisticResponse: {
          deleteGroups: {
            ok: true,
            deletedCount: deletedIds.length,
            deletedIds,
            restoreInfo: null,
          },
        },
      });
    },
    [deleteGroups]
  );

  const restoreAction = useCallback(
    (deletedIds) => {
      restoreGroups({
        variables: { groupIds: deletedIds },
        optimisticResponse: {
          restoreGroups: [...cache.read(READ_GROUPS, { groupIds: deletedIds })],
        },
      });
    },
    [cache, restoreGroups]
  );

  const options = {
    filterType: "dropdown",
    enableNestedDataAccess: ".",
    responsive: "vertical",
    sortOrder: {
      name: "name",
      direction: "asc",
    },
    onRowsDelete: async (deletedRows) => {
      onRowsDelete(deletedRows, groups, deleteAction, restoreAction);
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
