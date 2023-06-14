import { useCallback } from "react";
import { useAuthenticate } from "@auth/hooks/use-authenticate";
import { useMenu } from "@components/menu/use-menu";
import { IconButton, MenuItem } from "@mui/material";
import UserIcon from "@mui/icons-material/PersonOutline";

const UserMenu = () => {
  const { Menu, close, open } = useMenu();
  const { logout } = useAuthenticate();

  const logoutHandler = useCallback(() => {
    logout();
    close();
  }, [logout, close]);

  return (
    <>
      <IconButton type="button" sx={{ p: 1 }} color="top-bar" onClick={open}>
        <UserIcon />
      </IconButton>
      <Menu>
        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
