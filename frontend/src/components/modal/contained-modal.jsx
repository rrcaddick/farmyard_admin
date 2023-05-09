import _ from "lodash";
import { useMemo } from "react";
import { useIsDesktop } from "@hooks/use-is-desktop";
import { IconButton, Modal, Paper, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConainedModal = ({ children, open, close, container, containerProps, ...props }) => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  const defaultModalProps = useMemo(
    () => ({
      container: container.current,
      open,
      onClose: close,
      slotProps: { backdrop: { style: { position: "absolute" } } },
      sx: { flexGrow: 1, display: "flex", p: isDesktop ? 3 : 1.5, position: "absolute", ...theme.mixins.content },
    }),
    [container, open, close, isDesktop, theme.mixins.content]
  );

  const modalProps = useMemo(() => _.merge(defaultModalProps, props), [defaultModalProps, props]);

  const defaultContainerProps = useMemo(
    () => ({
      sx: {
        elevation: 24,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: "background.default",
        borderRadius: "5px",
        p: isDesktop ? 2 : 1,
        position: "relative",
      },
    }),
    [isDesktop]
  );

  const completeContainerProps = useMemo(
    () => _.merge(defaultContainerProps, containerProps),
    [defaultContainerProps, containerProps]
  );

  return (
    <Modal {...modalProps}>
      <Paper {...completeContainerProps}>
        <IconButton
          onClick={close}
          sx={{
            marginLeft: "auto",
          }}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </Paper>
    </Modal>
  );
};

export default ConainedModal;