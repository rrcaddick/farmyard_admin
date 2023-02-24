import { Box, Button, Modal, Typography } from "@mui/material";
import { useIsDesktop } from "@hooks/use-is-desktop";

const LogoutError = ({ modalOpen, setModalOpen }) => {
  const isDesktop = useIsDesktop();

  return (
    <Modal
      open={modalOpen}
      sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", mt: "2rem", mx: "1rem" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        backgroundColor="error.main"
        padding={isDesktop ? "2rem" : "1rem"}
        borderRadius="10px"
        gap="2rem"
        maxWidth="550px"
      >
        <Typography id="keep-mounted-modal-title" variant="h8" component="h2" textAlign="center">
          A logout error occurred. If you are on a public computer, we recommend clearing your browser cookies to keep
          your data safe
        </Typography>
        <Button variant="contained" onClick={() => setModalOpen(false)} fullWidth={true}>
          Okay
        </Button>
      </Box>
    </Modal>
  );
};

export default LogoutError;
