import MuiMenu from "@mui/material/Menu";
import { useMemo } from "react";

const MenuBase = ({ children, anchorOrigin, transformOrigin, anchorElememt, isOpen, close }) => {
  const _anchorOrigin = useMemo(
    () =>
      anchorOrigin
        ? anchorOrigin
        : {
            vertical: "bottom",
            horizontal: "right",
          },
    [anchorOrigin]
  );
  const _transformOrigin = useMemo(
    () =>
      transformOrigin
        ? transformOrigin
        : {
            vertical: "top",
            horizontal: "left",
          },
    [transformOrigin]
  );

  return (
    <MuiMenu
      anchorEl={anchorElememt}
      open={isOpen}
      onClose={close}
      anchorOrigin={_anchorOrigin}
      transformOrigin={_transformOrigin}
    >
      {children}
    </MuiMenu>
  );
};

export default MenuBase;
