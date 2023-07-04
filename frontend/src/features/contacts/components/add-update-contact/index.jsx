import { useIsDesktop } from "@hooks/use-is-desktop";
import { Divider, Typography, Box } from "@mui/material";
import { useModalContext } from "@components/modal/use-modal";
import ContactForm from "@contacts/components/add-update-contact/form";
import useLoading from "@components/loading/use-loading";
import useGetContactFormData from "@contacts/hooks/use-get-form-data";

const AddUpdateContact = () => {
  const isDesktop = useIsDesktop();

  const {
    openContext: { contactName },
  } = useModalContext();

  const {
    data: { groups, contactTypes },
    loading,
    serverErrors,
    refetch,
  } = useGetContactFormData();

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
        <ContactForm {...{ groups, contactTypes }} />
      </Box>
    </Loading>
  );
};
export default AddUpdateContact;
