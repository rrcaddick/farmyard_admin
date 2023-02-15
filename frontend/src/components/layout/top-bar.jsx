import { useContext } from "react";
import { AppBar, Box, IconButton, Toolbar, useTheme } from "@mui/material";
import { useColors } from "../../theme/hooks/useColors";
import { ThemeModeContext } from "../../theme";

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
          <IconButton type="button" sx={{ p: 1 }}>
            <PersonOutlinedIcon sx={{ color: colors.grey[100] }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
