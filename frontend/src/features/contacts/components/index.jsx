import { Box } from "@mui/material";
import Header from "@components/display/header";

const Contacts = () => {
  return (
    <Box display="flex" flexDirection="column" flexGrow={1} overflow="hidden">
      <Header title="Contacts" subtitle="Manage email blasts and whatsapp/messenger broadcasts" />
    </Box>
  );
};

export default Contacts;
