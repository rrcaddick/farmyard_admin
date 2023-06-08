import styled from "@mui/material/styles/styled";
import { useContext } from "react";
import { AppBar as MuiAppBar, Box, IconButton, Toolbar, useTheme } from "@mui/material";
import { ThemeModeContext } from "@theme";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import UserMenu from "@user/components/user-menu";
import SettingsMenu from "@settings/components/settings-menu";
import NotificationsMenu from "@notifications/components/notifications-menu";

// TODO: Clean up styles
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
          <NotificationsMenu />
          <SettingsMenu />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
