import { useState } from "react";
import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import TopBar from "@components/layout/top-bar";
import MobileTopBar from "@components/layout/mobile/top-bar";
import SideBar from "@components/layout/side-bar";
import MobileSideBar from "@components/layout/mobile/side-bar";
import DrawerHeader from "@components/layout/drawer-header";

import { Paper, useMediaQuery, useTheme } from "@mui/material";

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isLightMode = theme.palette.mode === "light";

  const [sidebarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen((x) => !x);
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
      {isDesktop ? (
        <>
          <TopBar {...{ sidebarOpen, toggleSideBar, drawerWidth }} />
          <SideBar {...{ sidebarOpen, drawerWidth, toggleSideBar }} />
        </>
      ) : (
        <>
          <MobileTopBar {...{ sidebarOpen, toggleSideBar }} />
          <MobileSideBar {...{ sidebarOpen, toggleSideBar }} />
        </>
      )}
      <Paper
        component="main"
        square={true}
        elevation={8}
        sx={{ flexGrow: 1, p: 3, overflow: "auto", ...(isLightMode && { backgroundColor: "#ececec" }) }}
      >
        <DrawerHeader />
        <Outlet />
      </Paper>
    </Box>
  );
};

export default Layout;
