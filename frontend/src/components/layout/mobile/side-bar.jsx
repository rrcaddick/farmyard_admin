import { useState } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import NavigationIcon from "@mui/icons-material/Navigation";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import Tabs from "@components/tabs/tabs";
import Tab from "@components/tabs/tab";

import MobileNavigation from "@navigation/components/mobile";
import Notifications from "@notifications/components";
import Settings from "@settings/components";
import User from "@user/components";

const SideBar = ({ sidebarOpen, toggleSideBar }) => {
  const [value, setValue] = useState(0);

  return (
    <SwipeableDrawer
      anchor="right"
      open={sidebarOpen}
      onClose={() => toggleSideBar(false)}
      onOpen={() => toggleSideBar(false)}
    >
      <Box sx={{ width: "75vw" }} role="presentation" onKeyDown={() => toggleSideBar(false)}>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)}>
          <Tab icon={<NavigationIcon />}>
            <MobileNavigation value={value} />
          </Tab>
          <Tab icon={<NotificationsOutlinedIcon />}>
            <Notifications value={value} />
          </Tab>
          <Tab icon={<SettingsOutlinedIcon />}>
            <Settings value={value} />
          </Tab>
          <Tab icon={<PersonOutlinedIcon />}>
            <User value={value} />
          </Tab>
        </Tabs>
      </Box>
    </SwipeableDrawer>
  );
};

export default SideBar;
