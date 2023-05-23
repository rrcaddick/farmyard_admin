import { Box } from "@mui/material";
import Header from "@components/display/header";
import CrudDataGrid from "@components/data-grid/crud-data-grid";
import { contactSchema } from "@contacts/schemas/contactSchema";

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
  return (
    <Box display="flex" flexDirection="column" flexGrow={1} overflow="hidden">
      <Header title="Finance" subtitle="Manage Finances" />
      <CrudDataGrid {...{ columns, schema: contactSchema, addButtonText: "Add Contact" }} />
    </Box>
  );
};

export default Finance;
