import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";

import Box from "@mui/material/Box";

import TopBar from "@components/layout/top-bar";
import MobileTopBar from "@components/layout/mobile/top-bar";
import SideBar from "@components/layout/side-bar";
import MobileSideBar from "@components/layout/mobile/side-bar";
import DrawerHeader from "@components/layout/drawer-header";

import { Paper } from "@mui/material";
import { useIsDesktop } from "@hooks/use-is-desktop";

const drawerWidth = 240;

const Layout = () => {
  const isDesktop = useIsDesktop();
  const container = useRef();

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
        elevation={20}
        ref={container}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: isDesktop ? 3 : 1.5,
          overflow: "auto",
          backgroundColor: "background.default",
        }}
      >
        <DrawerHeader />
        <Outlet context={{ container }} />
      </Paper>
    </Box>
  );
};

export default Layout;
