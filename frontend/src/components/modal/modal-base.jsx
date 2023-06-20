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
        position: "absolute",
        ...theme.mixins.removeAppBarHeight,
      },
      slotProps: { backdrop: { style: { position: "absolute" } } },
    }),
    [isDesktop, theme.mixins]
  );

  const defaultContainerProps = useMemo(
    () => ({
      sx: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        p: isDesktop ? 2 : 1,
      },
      elevation: 24,
    }),
    [isDesktop]
  );

  const defaultCloseIconProps = useMemo(
    () => ({
      sx: { position: "absolute", right: isDesktop ? "0.5rem" : 0, top: isDesktop ? "0.5rem" : 0, zIndex: 1501 },
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
