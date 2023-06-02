import ContainedModal from "@components/modal/contained-modal";
import { useIsDesktop } from "@hooks/use-is-desktop";
import { Divider, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import GroupForm from "./new-group-form";

//TODO: Look into adding modal that accepts children to outlet context
const NewBooking = ({ open, onClose, container }) => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  return (
    <ContainedModal {...{ open, onClose, container }}>
      <Box
        display="flex"
        flexDirection="column"
        flex={1}
        gap="1rem"
        flexGrow={1}
        overflow="hidden"
        paddingY="0.5rem"
        sx={{
          [theme.breakpoints.up("sm")]: {
            padding: "2rem",
            paddingLeft: "1rem",
            paddingBottom: "1rem",
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="700"
          color="primary.main"
          sx={{
            marginLeft: isDesktop ? "1rem" : "0.5rem",
          }}
        >
          Group Details:
        </Typography>
        <Divider
          light
          sx={{
            borderWidth: "1px",
            borderColor: "primary.dark",
            marginLeft: isDesktop ? "1rem" : "0.5rem",
          }}
        />
        <GroupForm {...{ onClose }} />
      </Box>
    </ContainedModal>
  );
};
export default NewBooking;
