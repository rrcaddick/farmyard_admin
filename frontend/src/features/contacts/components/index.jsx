import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateContact from "@contacts/components/add-update-contact";
import { useMemo } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGetContacts } from "@contacts/graphql/hooks";
import ViewIcon from "@mui/icons-material/Visibility";
import MuiDataTable from "@components/table/mui-data-table";
import { useIsDesktop } from "@hooks/use-is-desktop";
import useModal from "@components/modal/use-modal";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { GET_CONTACT_BY_ID } from "@contacts/graphql/queries";

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
  const { container } = useOutletContext();
  const { open, Modal: AddUpdateContactModal } = useModal();
  const isDesktop = useIsDesktop();
  const cache = useApolloCache();

  const { contacts, loading } = useGetContacts();

  //TODO: Show feedback for delete errors
  // const { mutate: deleteGroups, loading: deleteGroupsLoading, errors } = useDeleteGroups();

  const actions = useMemo(
    () => ({
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          return (
            <IconButton
              onClick={() => {
                const { __typename, ...contact } = cache.read(GET_CONTACT_BY_ID, { contactId: tableMeta.rowData[0] });
                return open({ contact, contactName: contact.name });
              }}
            >
              <ViewIcon />
            </IconButton>
          );
        },
      },
    }),
    [cache, open]
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
        <Header title="Contacts" />
        <Fab color="secondary" onClick={open}>
          <AddIcon />
        </Fab>
      </Box>
      <Box display="flex" flexGrow={1} overflow="hidden">
        <MuiDataTable
          title="View, Update or Add new contacts"
          data={contacts}
          columns={columns}
          options={options}
          loading={loading}
        />
      </Box>
      <AddUpdateContactModal modalProps={{ container: container.current }}>
        <AddUpdateContact />
      </AddUpdateContactModal>
    </Box>
  );
};

export default Contacts;
