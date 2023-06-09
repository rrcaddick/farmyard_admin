import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateGroup from "@groups/components/add-update-group";
import { useMemo } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGetAllGroups } from "@groups/hooks";
import ViewIcon from "@mui/icons-material/Visibility";
import MUIDataTable from "mui-datatables";
import { useIsDesktop } from "@hooks/use-is-desktop";
import useModal from "@components/modal/use-modal";
import { GET_GROUP_BY_ID } from "@groups/graphql/queries";
import { useApolloCache } from "@hooks/use-apollo-cache";
import useGroup from "@groups/hooks/use-group";

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

const getGroupFormData = (group) => {
  const {
    id,
    name,
    address: { street, suburb, postCode },
    groupType,
    contacts,
  } = group;
  return {
    id,
    name,
    address: { street, suburb, postCode },
    groupType: JSON.stringify(groupType),
    contacts: contacts.map(({ id, name, email, tel }) => ({
      id,
      name,
      email: email ?? "",
      tel: tel ?? "",
    })),
  };
};

const Groups = () => {
  const { container } = useOutletContext();
  const { open: openAddEditGroup, Modal: AddUpdateGroupModal } = useModal();

  const isDesktop = useIsDesktop();
  const cache = useApolloCache();

  const { groups, loading } = useGetAllGroups();
  //TODO: Show feedback for delete errors
  const { deleteGroups } = useGroup();

  const actions = useMemo(
    () => ({
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <IconButton
              onClick={() => {
                const group = cache.read(GET_GROUP_BY_ID, { groupId: tableMeta.rowData[0] });
                openAddEditGroup({
                  group: getGroupFormData(group),
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
    onRowsDelete: async (deletedRows, data) => {
      const deletedIds = deletedRows?.data.map(({ index }) => groups[index].id);
      try {
        deleteGroups({
          variables: { groupIds: deletedIds },
        });
        return true;
      } catch (error) {
        return false;
      }
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
        <MUIDataTable title="View, Update or Add new groups" data={groups} columns={columns} options={options} />
      </Box>
      <AddUpdateGroupModal modalProps={{ container: container.current }}>
        <AddUpdateGroup />
      </AddUpdateGroupModal>
    </Box>
  );
};

export default Groups;
