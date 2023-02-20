import { useContext } from "react";
import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme } from "@mui/material";
import { useColors } from "../../theme/hooks/useColors";
import { ThemeModeContext } from "../../theme";
import { useMenu } from "../hooks/use-menu";
import { useLogout } from "../../features/auth/hooks/use-logout";

// Icons
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from "@mui/icons-material/Menu";

const TopBar = ({ sidebarOpen, drawerWidth, openSideBar }) => {
  const theme = useTheme();
  const colors = useColors();
  const themeMode = useContext(ThemeModeContext);

  const { anchorEl, open, handleOpen, handleClose } = useMenu();
  const logout = useLogout();

  const logoutHandler = () => {
    logout();
    handleClose();
  };

  // TODO: Add lottie loading screen

  return (
    <AppBar
      position="sticky"
      display="flex"
      p="16px 16px 0 16px"
      sx={{
        ...(sidebarOpen && { width: `calc(100% - ${drawerWidth}px)`, marginLeft: `${drawerWidth}px` }),
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: colors.primary[800],
        }}
      >
        {!sidebarOpen && (
          <Box display="flex">
            <IconButton type="button" sx={{ p: 1 }} onClick={openSideBar}>
              <MenuIcon sx={{ color: colors.grey[100] }} />
            </IconButton>
          </Box>
        )}

        {/* Icons */}
        <Box display="flex" marginLeft="auto">
          <IconButton type="button" sx={{ p: 1 }} onClick={themeMode.toggleThemeMode}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon sx={{ color: colors.grey[100] }} />
            ) : (
              <DarkModeOutlinedIcon sx={{ color: colors.grey[100] }} />
            )}
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }}>
            <NotificationsOutlinedIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }}>
            <SettingsOutlinedIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
          <IconButton type="button" sx={{ p: 1 }} onClick={handleOpen}>
            <PersonOutlinedIcon sx={{ color: colors.grey[100] }} />
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
