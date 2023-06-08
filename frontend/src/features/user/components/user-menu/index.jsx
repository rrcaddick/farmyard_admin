import { useCallback } from "react";
import { useLogout } from "@auth/hooks/use-logout";
import { useMenu } from "@components/menu/use-menu";
import { IconButton, MenuItem } from "@mui/material";
import UserIcon from "@mui/icons-material/PersonOutline";

const UserMenu = () => {
  const { Menu, close, open } = useMenu();
  const logout = useLogout();

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
