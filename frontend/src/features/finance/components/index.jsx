import { Box, Button } from "@mui/material";
import Header from "@components/display/header";
import CrudDataGrid from "@components/data-grid/crud-data-grid";
import { contactSchema } from "@contacts/schemas/contactSchema";
import { useCallback, useRef, useState } from "react";
import DraggableDialog from "@components/dialog/draggable-dialog";

const columns = [
  {
    field: "name",
    headerName: "Name",
    editable: true,
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email Address",
    editable: true,
    flex: 1,
  },
  {
    field: "tel",
    headerName: "Tel",
    editable: true,
    flex: 1,
  },
];

const Finance = () => {
  const [contacts, setContacts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const dataGridState = useRef();

  const onSave = ({ isNew, ...data }) => {
    try {
      const index = contacts.findIndex(({ id }) => id === data.id);
      if (index === -1) {
        setContacts((prevContacts) => [data, ...prevContacts]);
      } else {
        setContacts((prevContacts) => [
          ...prevContacts.slice(0, index),
          Object.assign({}, prevContacts[index], data),
          ...prevContacts.slice(index + 1),
        ]);
      }
    } catch (error) {
      // TODO: Throw error for onProcessRowUpdateError
    }
  };

  const onDelete = useCallback((deletedId) => {
    setContacts((prevContacts) => prevContacts.filter(({ id }) => id !== deletedId));
  }, []);

  const submitHandler = useCallback(() => {
    const { isEditing, disgardUnsavedChanges } = dataGridState.current;
    if (isEditing) disgardUnsavedChanges();
    setModalOpen(false);

    console.log(contacts);
  }, [setModalOpen, contacts]);

  const toggleModal = useCallback((open = null) => {
    setModalOpen((modalOpen) => open ?? !modalOpen);
  }, []);

  return (
    <>
      <Box display="flex" flexDirection="column" flexGrow={1} overflow="hidden">
        <Header title="Finance" subtitle="Manage Finances" />
        <CrudDataGrid
          {...{
            columns,
            onSave,
            onDelete,
            ref: dataGridState,
            existingRows: contacts,
            schema: contactSchema,
            addButtonText: "Add Contact",
          }}
        />
        <Button onClick={() => (dataGridState.current?.isEditing ? toggleModal() : submitHandler())}>Submit</Button>
      </Box>
      <DraggableDialog
        open={modalOpen}
        title="Disgard changes"
        content="You have unsaved contacts. Unsaved changes will be disgarded"
        actions={
          <>
            <Button variant="outlined" onClick={() => toggleModal()}>
              Back
            </Button>
            <Button variant="contained" color="info" onClick={submitHandler}>
              Contine
            </Button>
          </>
        }
      />
    </>
  );
};

export default Finance;
