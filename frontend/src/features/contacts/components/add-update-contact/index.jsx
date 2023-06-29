import { useIsDesktop } from "@hooks/use-is-desktop";
import { Divider, Typography, useTheme, Box } from "@mui/material";
import { useModalContext } from "@components/modal/use-modal";
import ContactForm from "@contacts/components/add-update-contact/form";
import { useApolloQuery } from "@hooks/use-apollo-query";
import { GET_GROUPS } from "@groups/graphql/queries";
import useLoading from "@components/loading/use-loading";

const AddUpdateContact = () => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  const {
    openContext: { contactName },
  } = useModalContext();

  const { data: groups, loading, serverErrors, refetch } = useApolloQuery(GET_GROUPS);

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
        padding={isDesktop ? "2rem" : "1rem"}
      >
        <Typography variant="h4" fontWeight="700" color="primary.main" {...(!isDesktop && { textAlign: "center" })}>
          {contactName ?? "New Contact Details:"}
        </Typography>
        <Divider
          light
          sx={{
            borderWidth: "1px",
            borderColor: "primary.dark",
          }}
        />
        <ContactForm {...{ groups }} />
      </Box>
    </Loading>
  );
};
export default AddUpdateContact;
