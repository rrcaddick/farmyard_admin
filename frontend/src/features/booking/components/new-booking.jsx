import ContainedModal from "@components/modal/contained-modal";
import { Typography } from "@mui/material";

const NewBooking = ({ open, close, container }) => {
  return (
    <ContainedModal {...{ open, close, container }}>
      <Typography>Test</Typography>
    </ContainedModal>
  );
};

export default NewBooking;
