import ContainedModal from "@components/modal/contained-modal";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { useIsDesktop } from "@hooks/use-is-desktop";
import { Divider, Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import GroupForm from "./form";
import { GET_GROUP_BY_ID } from "@groups/graphql/queries";
import { useGetAllGroupTypes } from "@groups/graphql/hooks";

const AddUpdateGroup = ({ open, onClose, container, groupId }) => {
  const [group, setGroup] = useState();

  const theme = useTheme();
  const isDesktop = useIsDesktop();
  const cache = useApolloCache();

  const { groupTypes, loading, error } = useGetAllGroupTypes();

  useEffect(() => {
    const group = cache.read(GET_GROUP_BY_ID, { groupId });
    if (group) {
      const {
        id,
        name,
        address: { street, suburb, postCode },
        groupType,
        contacts,
      } = group;
      setGroup({
        id,
        name,
        address: { street, suburb, postCode },
        groupType: JSON.stringify(groupType),
        contacts: contacts.map(({ id, name, email, tel }) => ({ id, name, email: email ?? "", tel: tel ?? "" })),
      });

      return () => setGroup();
    }
  }, [groupId, cache]);

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
          {groupId ? group?.name : "New Group Details:"}
        </Typography>
        <Divider
          light
          sx={{
            borderWidth: "1px",
            borderColor: "primary.dark",
            marginLeft: isDesktop ? "1rem" : "0.5rem",
          }}
        />
        <GroupForm {...{ onClose, groupTypes, ...(group && { group }) }} />
      </Box>
    </ContainedModal>
  );
};
export default AddUpdateGroup;
