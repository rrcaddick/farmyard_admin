import TopBar from "./top-bar";
import SideBar from "./side-bar";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { IconButton } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // Keeps content under the app bar
  ...theme.mixins.toolbar,
}));

const Layout = ({ children }) => {
  const theme = useTheme();
  const [sidebarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen((x) => !x);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar sidebarOpen={sidebarOpen} toggleSideBar={toggleSideBar} drawerWidth={drawerWidth} />

      <SideBar
        sidebarOpen={sidebarOpen}
        drawerWidth={drawerWidth}
        header={
          <DrawerHeader>
            <IconButton onClick={toggleSideBar}>
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
        }
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
