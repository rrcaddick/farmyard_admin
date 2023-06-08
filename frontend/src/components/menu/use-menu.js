import { useCallback, useMemo, useState } from "react";
import MenuBase from "./menu-base";

const useMenu = () => {
  const [anchorElememt, setAnchorElememt] = useState(null);

  const isOpen = useMemo(() => Boolean(anchorElememt), [anchorElememt]);

  const open = useCallback((event) => {
    setAnchorElememt(event.currentTarget);
  }, []);

  const close = useCallback(() => {
    setAnchorElememt(null);
  }, []);

  const Menu = useCallback(
    ({ children, anchorOrigin, transformOrigin }) => (
      <MenuBase {...{ children, anchorOrigin, transformOrigin, anchorElememt, isOpen, close }} />
    ),
    [anchorElememt, isOpen, close]
  );

  return {
    open,
    close,
    Menu,
  };
};

export { useMenu };
