import { Button, List } from "@mui/material";
import React from "react";
import TabPanel from "../../../components/navigation/tab-panel";
import { useLogout } from "../../auth/hooks/use-logout";

const User = ({ value, index }) => {
  const logout = useLogout();

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
