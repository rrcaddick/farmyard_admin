import { useIsDesktop } from "@hooks/use-is-desktop";
import { Divider, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import GroupForm from "./form";
import { useModalContext } from "@components/modal/use-modal";
import useLoading from "@components/loading/use-loading";
import { GET_GROUP_TYPES } from "@groups/graphql/queries";
import { useApolloQuery } from "@hooks/use-apollo-query";

const AddUpdateGroup = () => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();
  const { data: groupTypes, loading, serverErrors, refetch } = useApolloQuery(GET_GROUP_TYPES);

  const {
    openContext: { groupName },
  } = useModalContext();

  const { Loading } = useLoading(loading);

  return (
    <Loading error={serverErrors?.networkError || serverErrors?.serverError} retry={refetch}>
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
          {...(!isDesktop && { textAlign: "center" })}
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
    </Loading>
  );
};
export default AddUpdateGroup;
