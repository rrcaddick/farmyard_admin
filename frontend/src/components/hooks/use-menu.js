import { useCallback, useMemo, useState } from "react";
import MuiMenu from "@mui/material/Menu";

const useMenu = () => {
  const [anchorElememt, setAnchorElememt] = useState(null);

  const isOpen = useMemo(() => Boolean(anchorElememt), [anchorElememt]);

  const open = useCallback((event) => {
    setAnchorElememt(event.currentTarget);
  }, []);

  const close = useCallback(() => {
    setAnchorElememt(null);
  }, []);

  const Menu = ({ children, anchorOrigin, transformOrigin }) => {
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

  return {
    anchorElememt,
    isOpen,
    open,
    close,
    Menu,
  };
};

export { useMenu };
