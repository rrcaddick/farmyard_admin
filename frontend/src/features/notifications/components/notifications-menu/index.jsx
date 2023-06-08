import { useCallback } from "react";
import { useMenu } from "@components/hooks/use-menu";
import { IconButton, MenuItem } from "@mui/material";
import BellIcon from "@mui/icons-material/NotificationsOutlined";

const NotificationsMenu = () => {
  const { Menu, open } = useMenu();

  return (
    <>
      <IconButton type="button" sx={{ p: 1 }} color="top-bar" onClick={open}>
        <BellIcon />
      </IconButton>
      <Menu>
        <MenuItem>Notification Items...</MenuItem>
      </Menu>
    </>
  );
};

export default NotificationsMenu;
