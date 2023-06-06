import ContainedModal from "@components/modal/contained-modal";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { useIsDesktop } from "@hooks/use-is-desktop";
import { Divider, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import ContactForm from "@contacts/components/add-update-contact/form";
import { GET_CONTACT_BY_ID } from "@contacts/graphql/queries";

//TODO: Look into adding modal that accepts children to outlet context
const AddUpdateContact = ({ open, onClose, container, contactId }) => {
  const [contact, setContact] = useState();

  const theme = useTheme();
  const isDesktop = useIsDesktop();
  const cache = useApolloCache();

  useEffect(() => {
    const contact = cache.read(GET_CONTACT_BY_ID, { contactId });
    if (contact) {
      const { id, name, email, tel } = contact;
      setContact({ id, name, email, tel });
    }
  }, [contactId, cache]);

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
          {contactId ? contact?.name : "New Contact Details:"}
        </Typography>
        <Divider
          light
          sx={{
            borderWidth: "1px",
            borderColor: "primary.dark",
            marginLeft: isDesktop ? "1rem" : "0.5rem",
          }}
        />
        <ContactForm {...{ onClose, ...(contact && { contact }) }} />
      </Box>
    </ContainedModal>
  );
};
export default AddUpdateContact;
