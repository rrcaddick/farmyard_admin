import { Box, Button, Typography } from "@mui/material";
import Header from "@components/display/header";
import useModal from "@components/modal/use-modal";

const Projects = () => {
  const { open, close, Modal } = useModal();
  return (
    <Box display="flex" flexDirection="column" overflow="hidden" gap={5}>
      <Header title="Projects" subtitle="Never let a project fail again" />
      <Button onClick={open} variant="contained">
        Click this button
      </Button>
      <Modal>
        <Typography>This is inside the modal</Typography>
      </Modal>
    </Box>
  );
};

export default Projects;
