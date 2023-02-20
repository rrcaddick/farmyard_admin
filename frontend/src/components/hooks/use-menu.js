import { useCallback, useMemo, useState } from "react";

const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    anchorEl,
    open,
    handleOpen,
    handleClose,
  };
};

export { useMenu };
