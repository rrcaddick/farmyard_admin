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

// FIXME: Makes background color work
const MainWrapper = ({ children, themeMode }) => {
  if (themeMode === "dark")
    return (
      <Paper component="main" square={true} elevation={8} sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Paper>
    );

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      {children}
    </Box>
  );
};

const Layout = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [sidebarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen((x) => !x);
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      {isDesktop ? (
        <>
          <TopBar sidebarOpen={sidebarOpen} toggleSideBar={toggleSideBar} drawerWidth={drawerWidth} />
          <SideBar sidebarOpen={sidebarOpen} drawerWidth={drawerWidth} toggleSideBar={toggleSideBar} />
        </>
      ) : (
        <>
          <MobileTopBar sidebarOpen={sidebarOpen} toggleSideBar={toggleSideBar} />
          <MobileSideBar sidebarOpen={sidebarOpen} toggleSideBar={toggleSideBar} />
        </>
      )}

      <MainWrapper themeMode={theme.palette.mode}>
        <DrawerHeader />
        <Outlet />
      </MainWrapper>
    </Box>
  );
};

export default Layout;
