import { Button, List } from "@mui/material";
import TabPanel from "@components/tabs/tab-panel";
import { useAuthenticate } from "@auth/hooks/use-authenticate";

const User = ({ value, index }) => {
  const { logout } = useAuthenticate();

  return (
    <TabPanel value={value} index={index}>
      <List sx={{ display: "flex", flexDirection: "column", gap: "5px", padding: "5px" }}>
        <Button variant="contained" color="secondary" onClick={logout}>
          Logout
        </Button>
      </List>
    </TabPanel>
  );
};

export default User;
