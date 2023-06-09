import { useModalContext } from "@components/modal/use-modal";
import { Box, Button, Typography } from "@mui/material";

const ModalContent = () => {
  const { close } = useModalContext();
  return (
    <Box>
      <Typography>This is inside the modal</Typography>
      <Button onClick={close}>Back</Button>
    </Box>
  );
};

export default ModalContent;
