import styled from "@mui/material/styles/styled";
import { useContext } from "react";
import { AppBar as MuiAppBar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme } from "@mui/material";
import { ThemeModeContext } from "@theme";
import { useMenu } from "@components/hooks/use-menu";
import { useLogout } from "@auth/hooks/use-logout";

import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => !["sidebarOpen", "drawerWidth"].includes(prop),
})(({ theme, sidebarOpen, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(sidebarOpen && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const TopBar = ({ sidebarOpen, toggleSideBar, drawerWidth }) => {
  const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);

  const { anchorEl, open, handleOpen, handleClose } = useMenu();
  const logout = useLogout();

  const logoutHandler = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="fixed" sidebarOpen={sidebarOpen} drawerWidth={drawerWidth}>
      <Toolbar>
        <IconButton
          onClick={toggleSideBar}
          edge="start"
          color="top-bar"
          sx={{
            marginRight: 5,
            ...(sidebarOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        {/* Icons */}
        <Box display="flex" marginLeft="auto">
          <IconButton type="button" sx={{ p: 1 }} color="top-bar" onClick={themeMode.toggleThemeMode}>
            {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }} color="top-bar">
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }} color="top-bar">
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }} color="top-bar" onClick={handleOpen}>
            <PersonOutlinedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
