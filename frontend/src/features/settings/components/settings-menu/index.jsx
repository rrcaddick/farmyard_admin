import { useCallback } from "react";
import { useMenu } from "@components/menu/use-menu";
import { IconButton, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

const SettingsMenuBased = () => {
  const { Menu, open } = useMenu();

  return (
    <>
      <IconButton type="button" sx={{ p: 1 }} color="top-bar" onClick={open}>
        <SettingsIcon />
      </IconButton>
      <Menu>
        <MenuItem>Settings Items...</MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenuBased;
