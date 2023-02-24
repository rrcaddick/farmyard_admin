import { useContext } from "react";
import { IconButton, useTheme } from "@mui/material";
import TabPanel from "@components/tabs/tab-panel";
import { ThemeModeContext } from "@theme";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

const Settings = ({ value, index }) => {
  const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);

  return (
    <TabPanel value={value} index={index}>
      <IconButton type="button" color="inherit" sx={{ p: 1 }} onClick={themeMode.toggleThemeMode}>
        {theme.palette.mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </TabPanel>
  );
};

export default Settings;
