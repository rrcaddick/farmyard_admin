import { useMemo } from "react";
import { IconButton, Modal, Paper, useTheme } from "@mui/material";
import { useIsDesktop } from "@hooks/use-is-desktop";
import _ from "lodash";
import CloseIcon from "@mui/icons-material/Close";

const ModalBase = ({ children, close, isOpen, modalProps, containerProps, closeIconProps }) => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  const defaultModalProps = useMemo(
    () => ({
      sx: {
        display: "flex",
        flexGrow: 1,
        p: isDesktop ? 3 : 1.5,
        ...theme.mixins.removeAppBarHeight,
        position: "absolute",
      },
      slotProps: { backdrop: { style: { position: "absolute" } } },
    }),
    [isDesktop, theme.mixins.removeAppBarHeight]
  );

  const defaultContainerProps = useMemo(
    () => ({
      sx: { position: "relative", flexGrow: 1, p: isDesktop ? 3 : 1.5 },
      elevation: 24,
    }),
    [isDesktop]
  );

  const defaultCloseIconProps = useMemo(
    () => ({
      sx: { position: "absolute", right: "0.5rem", top: "0.5rem", zIndex: 1501 },
    }),
    []
  );

  const mergedModalProps = useMemo(() => _.merge(defaultModalProps, modalProps), [defaultModalProps, modalProps]);

  const mergedContainerProps = useMemo(
    () => _.merge(defaultContainerProps, containerProps),
    [defaultContainerProps, containerProps]
  );

  const mergedCloseIconProps = useMemo(
    () => _.merge(defaultCloseIconProps, closeIconProps),
    [defaultCloseIconProps, closeIconProps]
  );

  return (
    <Modal open={isOpen} onClose={close} {...mergedModalProps}>
      <Paper {...mergedContainerProps}>
        <IconButton onClick={close} {...mergedCloseIconProps}>
          <CloseIcon />
        </IconButton>
        {children}
      </Paper>
    </Modal>
  );
};

export default ModalBase;
