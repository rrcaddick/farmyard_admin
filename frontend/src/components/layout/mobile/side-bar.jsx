import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import Tabs from "../../navigation/tabs";
import Tab from "../../navigation/tab";

import MobileNavigation from "../../navigation/mobile-navigation";
import Notifications from "../../../features/notifications/components";
import Settings from "../../../features/settings/components";
import User from "../../../features/user/components";

import NavigationIcon from "@mui/icons-material/Navigation";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useState } from "react";

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
