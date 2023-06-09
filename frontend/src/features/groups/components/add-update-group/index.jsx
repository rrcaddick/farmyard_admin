import { useIsDesktop } from "@hooks/use-is-desktop";
import { Divider, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import GroupForm from "./form";
import { useGetAllGroupTypes } from "@groups/graphql/hooks";
import { useModalContext } from "@components/modal/use-modal";

const AddUpdateGroup = () => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();
  const { groupTypes, loading, error } = useGetAllGroupTypes();
  const {
    openContext: { groupName },
  } = useModalContext();

  return (
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
        {groupName ?? "New Group Details:"}
      </Typography>
      <Divider
        light
        sx={{
          borderWidth: "1px",
          borderColor: "primary.dark",
          marginLeft: isDesktop ? "1rem" : "0.5rem",
        }}
      />
      <GroupForm {...{ groupTypes }} />
    </Box>
  );
};
export default AddUpdateGroup;
