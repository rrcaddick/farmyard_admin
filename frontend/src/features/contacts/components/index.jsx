import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateContact from "@contacts/components/add-update-contact";
import { useMemo, useState } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGetAllContacts } from "@contacts/graphql/hooks";
import ViewIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Update";
import MUIDataTable from "mui-datatables";
import { useIsDesktop } from "@hooks/use-is-desktop";

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
    name: "type",
    label: "Type",
  },
  {
    name: "name",
    label: "Name",
  },
  {
    name: "email",
    label: "Email Address",
  },
  {
    name: "tel",
    label: "Contact Number",
  },
];

const Contacts = () => {
  const [openNewGroup, setOpenNewGroup] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState();

  const { container } = useOutletContext();
  const isDesktop = useIsDesktop();

  const { contacts, loading } = useGetAllContacts();
  //TODO: Show feedback for delete errors
  // const { mutate: deleteGroups, loading: deleteGroupsLoading, errors } = useDeleteGroups();

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
                return toggleAddUpdateGroup(true, tableMeta.rowData[0]);
              }}
            >
              <ViewIcon />
            </IconButton>
          );
        },
      },
    }),
    []
  );

  const columns = useMemo(() => [...columnDefs, actions], [actions]);

  const options = {
    filterType: "dropdown",
    enableNestedDataAccess: ".",
    responsive: "vertical",
    // onRowsDelete: async (deletedRows, data) => {
    //   const deletedIds = deletedRows?.data.map(({ index }) => groups[index].id);
    //   try {
    //     await deleteGroups({
    //       variables: { groupIds: deletedIds },
    //     });
    //     return true;
    //   } catch (error) {
    //     return false;
    //   }
    // },
  };

  const toggleAddUpdateGroup = (action, selectedContactId) => {
    setSelectedContactId(selectedContactId ? selectedContactId : null);
    setOpenNewGroup(action);
  };

  return (
    <>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        gap="1rem"
        overflow="hidden"
        {...(!isDesktop && { paddingTop: "0.5rem" })}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" px="10px">
          <Header title="Contacts" />
          <Fab color="secondary" onClick={() => toggleAddUpdateGroup(true)}>
            <AddIcon />
          </Fab>
        </Box>
        <Box display="flex" flexGrow={1} overflow="hidden">
          <MUIDataTable title="View, Update or Add new contacts" data={contacts} columns={columns} options={options} />
        </Box>
      </Box>
      <AddUpdateContact
        {...{ container, open: openNewGroup, contactId: selectedContactId }}
        onClose={() => toggleAddUpdateGroup(false)}
      />
    </>
  );
};

export default Contacts;
