import { Box, Button } from "@mui/material";
import Header from "@components/display/header";
import useModal from "@components/modal/use-modal";
import ModalContent from "./test/modal-content";
import { useOutletContext } from "react-router-dom";

const Projects = () => {
  const { open, Modal } = useModal();
  const { container } = useOutletContext();

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" gap={5}>
      <Header title="Projects" subtitle="Never let a project fail again" />
      <Button onClick={open} variant="contained">
        Click this button
      </Button>
      <Modal modalProps={{ container: container.current }}>
        <ModalContent />
      </Modal>
    </Box>
  );
};

export default Projects;
