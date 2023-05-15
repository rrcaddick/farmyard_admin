import { Box, Button, Divider, TextField } from "@mui/material";
import Header from "@components/display/header";
import BasicTable from "@booking/components/new-booking/example-table";

const Contacts = () => {
  return (
    <Box display="flex" flexDirection="column" flexGrow={1} overflow="hidden">
      <Header title="Contacts" subtitle="Manage email blasts and whatsapp/messenger broadcasts" />
      <Box display="flex" flexGrow={1} padding={2} paddingBottom={0} gap={2} overflow="hidden">
        <Box display="flex" flexDirection="column" flex={1} flexGrow={1}>
          <Box py={1} display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={4}>
              <TextField
                variant="outlined"
                type="search"
                label="Search Group"
                fullWidth
                placeholder="Eg: New Apostolic"
              />
            </Box>
            <Box flex={1} display="flex" justifyContent="center">
              <Button variant="outlined">NEW GROUP</Button>
            </Box>
          </Box>
          <Box sx={{ overflow: "hidden", display: "flex", flexDirection: "column" }} flexGrow={1}>
            <BasicTable />
          </Box>
        </Box>

        <Divider orientation="vertical" />
        <Box display="flex" flexDirection="column" flex={1} gap={2}></Box>
      </Box>
    </Box>
  );
};

export default Contacts;
