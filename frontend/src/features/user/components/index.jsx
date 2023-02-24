import { Button, List } from "@mui/material";
import TabPanel from "@components/tabs/tab-panel";
import { useLogout } from "@auth/hooks/use-logout";

const User = ({ value, index }) => {
  const logout = useLogout();

  const logoutHandler = () => {
    logout();
  };

  return (
    <TabPanel value={value} index={index}>
      <List sx={{ display: "flex", flexDirection: "column", gap: "5px", padding: "5px" }}>
        <Button variant="contained" color="secondary" onClick={logoutHandler}>
          Logout
        </Button>
      </List>
    </TabPanel>
  );
};

export default User;
