import TopBar from "./top-bar";
import MobileTopBar from "./mobile/top-bar";
import SideBar from "./side-bar";
import MobileSideBar from "./mobile/side-bar";
import DrawerHeader from "./drawer-header";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const drawerWidth = 240;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [sidebarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen((x) => !x);
  };

  return (
    <Box sx={{ display: "flex" }}>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
