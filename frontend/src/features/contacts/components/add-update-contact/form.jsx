import styled from "@emotion/styled";
import TextInput from "@components/input/text-input";
import SelectInput from "@components/input/select-input";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { contactSchema } from "@contacts/schemas/contact-schema";
import { Box, Button, IconButton, Divider, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useGetAllGroupTypes, useUpdateGroup } from "@groups/graphql/hooks";
// import { useCreateGroup } from "@contacts /graphql/hooks/use-create-contact";
import { generateTempId } from "@graphql/utils/generate-temp-id";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useIsDesktop } from "@hooks/use-is-desktop";
import { useModalContext } from "@components/modal/use-modal";

const createGroupTypeSelectOptions = (groupTypes) => {
  return groupTypes.map((groupType) => {
    const {
      id,
      type: text,
      price: { id: price },
    } = groupType;

    return { id, text, price };
  });
};

const createOptimisticResponse = (data) => {
  const { groupType, address, contacts, ...contact } = data;
  const groupResponse = {
    __typename: "Contact",
    id: generateTempId("Contact"),
    ...contact,
    groupType: {
      __typename: "GroupType",
      ...{ ...groupType, price: { id: groupType.price } },
    },
    address: {
      __typename: "Address",
      ...address,
    },
    contacts: [
      ...contacts.map((contact) => ({
        __typename: "Contact",
        id: contact.id ?? generateTempId("Contact"),
        type: "Contact",
        ...contact,
      })),
    ],
  };

  return groupResponse;
};

const ContactForm = () => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  const {
    close,
    openContext: { contact },
  } = useModalContext();

  // const { mutate: createGroup, loading: createGroupLoading, serverErrors, clearServerError } = useCreateGroup();
  // const {
  //   mutate: updateGroup,
  //   loading: updateGroupLoading,
  //   serverErrors: updateServerErrors,
  //   clearServerError: clearUpdateErrors,
  // } = useUpdateGroup();

  const resolver = useYupValidationResolver(contactSchema);

  const formMethods = useForm({
    resolver,
    mode: "all",
    values: contact,
  });

  const {
    handleSubmit,
    reset,
    control,
    setFocus,
    formState: { isValid, isDirty },
  } = formMethods;
  const { fields, append, remove } = useFieldArray({ name: "contacts", control });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const submitHandler = useCallback(
    // ({ groupType: groupTypeId, address, contacts, ...data }) => {
    //   if (contact) {
    //     updateGroup({
    //       variables: { input: groupData },
    //       optimisticResponse: {
    //         updateGroup: createOptimisticResponse(groupData),
    //       },
    //     });
    //   } else {
    //     createGroup({
    //       variables: { input: groupData },
    //       optimisticResponse: {
    //         createGroup: createOptimisticResponse(groupData),
    //       },
    //     });
    //   }

    //   reset();
    //   onClose();
    // },
    () => {},
    []
  );

  //TODO: Intercept next button on mobile and add select to next order

  return (
    <>
      <FormProvider {...formMethods}>
        <Box
          component="form"
          onSubmit={handleSubmit(submitHandler)}
          noValidate
          display="flex"
          flexDirection="column"
          flexGrow={1}
          overflow="hidden"
          gap="2rem"
          paddingTop="10px"
        >
          <Box display="flex" flexGrow={1}>
            <Box flex={1}>Search groups here</Box>
            <Box flex={1} display="flex" flexDirection="column">
              <TextInput
                variant="standard"
                name="name"
                label="Contact Name"
                placeholder="Eg: John Doe"
                fullWidth
                InputProps={{ inputProps: { tabIndex: 1 } }}
                // serverError={serverErrors?.name}
                // //TODO: Think of way to add this to the TextInput component
                // {...(serverErrors?.name && {
                //   onChange: ({ target }) => {
                //     clearServerError(target?.name);
                //   },
                // })}
              />
              <TextInput
                variant="standard"
                name="email"
                label="Email Address"
                placeholder="Eg: example@example.com"
                fullWidth
                InputProps={{ inputProps: { tabIndex: 1 } }}
                // serverError={serverErrors?.name}
                // //TODO: Think of way to add this to the TextInput component
                // {...(serverErrors?.name && {
                //   onChange: ({ target }) => {
                //     clearServerError(target?.name);
                //   },
                // })}
              />
              <TextInput
                variant="standard"
                name="tel"
                label="Contact Number"
                placeholder="Eg: 076 363 5909"
                fullWidth
                InputProps={{ inputProps: { tabIndex: 1 } }}
                // serverError={serverErrors?.name}
                // //TODO: Think of way to add this to the TextInput component
                // {...(serverErrors?.name && {
                //   onChange: ({ target }) => {
                //     clearServerError(target?.name);
                //   },
                // })}
              />
            </Box>
          </Box>
          <Divider
            light
            sx={{
              borderWidth: "1px",
              borderColor: "primary.dark",
              marginLeft: "0.5rem",
              [theme.breakpoints.up("sm")]: {
                marginLeft: "1rem",
              },
              marginTop: "auto",
            }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button type="submit" color="secondary" onClick={close}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={!isValid || !isDirty}>
              {contact ? "Update" : "Add"} Contact
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </>
  );
};

export default ContactForm;
