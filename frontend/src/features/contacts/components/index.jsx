import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateContact from "@contacts/components/add-update-contact";
import { useCallback, useMemo } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import ViewIcon from "@mui/icons-material/Visibility";
import { useIsDesktop } from "@hooks/use-is-desktop";
import useModal from "@components/modal/use-modal";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { GET_CONTACTS, READ_CONTACT, READ_CONTACTS } from "@contacts/graphql/queries";
import { useApolloQuery } from "@hooks/use-apollo-query";
import { parseGraphqlData } from "@utils/form";
import { useContact } from "@contacts/hooks/use-contact";
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
  const { open: openAddEditContact, Modal: AddUpdateContactModal } = useModal();
  const isDesktop = useIsDesktop();
  const cache = useApolloCache();

  const { data: contacts, loading, serverErrors, refetch } = useApolloQuery(GET_CONTACTS);

  const { deleteContacts, restoreContacts } = useContact();

  const { MuiDataTable, onRowsDelete } = useMuiDataTable();

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
                const contact = cache.read(READ_CONTACT, { contactId: tableMeta.rowData[0] });
                openAddEditContact({
                  contact: parseGraphqlData(contact),
                  contactName: contact.name,
                });
              }}
            >
              <ViewIcon />
            </IconButton>
          );
        },
      },
    }),
    [cache, openAddEditContact]
  );

  const columns = useMemo(() => [...columnDefs, actions], [actions]);

  const deleteAction = useCallback(
    async (deletedIds) => {
      return await deleteContacts({
        variables: { contactIds: deletedIds },
        optimisticResponse: {
          deleteContacts: {
            ok: true,
            deletedCount: deletedIds.length,
            deletedIds,
            restoreInfo: "",
          },
        },
      });
    },
    [deleteContacts]
  );

  const restoreAction = useCallback(
    (contactIds, restoreInfo) => {
      restoreContacts({
        variables: { contactIds, restoreInfo },
        optimisticResponse: {
          restoreContacts: [...cache.read(READ_CONTACTS, { contactIds })],
        },
      });
    },
    [cache, restoreContacts]
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
      onRowsDelete(deletedRows, contacts, deleteAction, restoreAction);
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
        <Header title="Contacts" />
        <Fab color="secondary" onClick={openAddEditContact}>
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
          retry={refetch}
          error={serverErrors?.networkError || serverErrors?.serverError}
        />
      </Box>
      <AddUpdateContactModal modalProps={{ container: container.current }}>
        <AddUpdateContact />
      </AddUpdateContactModal>
    </Box>
  );
};

export default Contacts;
