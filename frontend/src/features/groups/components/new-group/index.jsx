import Header from "@components/display/header";
import ContainedModal from "@components/modal/contained-modal";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import GroupForm from "./new-group-form";

//TODO: Look into adding modal that accepts children to outlet context
const NewBooking = ({ open, onClose, container }) => {
  return (
    <ContainedModal {...{ open, onClose, container }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex={1}
        gap="2rem"
        // py={2}
        px={2}
        sx={{ overflowY: "auto" }}
      >
        <Typography variant="h4" textAlign="center">
          ADD A NEW GROUP
        </Typography>
        <GroupForm {...{ onClose }} />
      </Box>
    </ContainedModal>
  );
};
export default NewBooking;
