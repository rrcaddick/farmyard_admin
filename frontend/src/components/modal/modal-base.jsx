import { IconButton, Modal, Paper, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useIsDesktop } from "@hooks/use-is-desktop";

const ModalBase = ({ children, close, isOpen, containerRef }) => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  return (
    <Modal
      open={isOpen}
      {...(containerRef && { container: containerRef })}
      sx={{
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        flexGrow: 1,
        // p: isDesktop ? 3 : 1.5,
        ...theme.mixins.removeAppBarHeight,
      }}
    >
      <Paper sx={{ position: "relative", flexGrow: 1, height: "100%", m: "5rem", ...theme.mixins.removeAppBarHeight }}>
        <IconButton onClick={close} sx={{ position: "absolute", right: 0 }}>
          <CloseIcon />
        </IconButton>
        {children}
      </Paper>
    </Modal>
  );
};

export default ModalBase;
