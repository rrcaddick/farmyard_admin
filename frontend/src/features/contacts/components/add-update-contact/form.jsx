import styled from "@emotion/styled";
import TextInput from "@components/input/text-input";
import SelectInput from "@components/input/select-input";
import { useCallback, useEffect, useMemo } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { contactSchema } from "@contacts/schemas/contact-schema";
import { Box, Button, IconButton, Divider, useTheme, Autocomplete, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { generateTempId } from "@graphql/utils/generate-temp-id";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useIsDesktop } from "@hooks/use-is-desktop";
import { useModalContext } from "@components/modal/use-modal";
import { useContact } from "@contacts/hooks/use-contact";
import { useManageDirtyValues } from "@hooks/use-manage-dirty-values";
import { createOptimisticResponse } from "@graphql/utils/create-optimistic-response";
import { createResponseSchema, updateResponseSchema } from "@contacts/schemas/graphql-responses";
import useLoading from "@components/loading/use-loading";
import AutoCompleteInput from "@components/input/auto-complete-input";

const Image = styled.img`
  width: 100%;
  height: auto;
  flex-shrink: 1;
`;

const ContactForm = ({ groups }) => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  const {
    close,
    openContext: { contact },
  } = useModalContext();

  const formMethods = useForm({
    resolver: useYupValidationResolver(contactSchema),
    mode: "all",
    defaultValues: contact,
  });

  const {
    handleSubmit,
    reset,
    setFocus,
    getValues,
    watch,
    trigger,
    formState: { isValid, isDirty },
  } = formMethods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onComplete = useCallback(() => {
    reset();
    close();
  }, [reset, close]);

  const { createContact, updateContact, loading, serverErrors, clearServerError } = useContact({
    onCreateComplete: onComplete,
    onUpdateComplete: onComplete,
  });

  const { Loading } = useLoading(loading);

  const { getDirtyData } = useManageDirtyValues();

  const submitHandler = useCallback(
    (data) => {
      // Update contact
      if (contact) {
        const dirtyData = getDirtyData(contact, data, {
          withId: true,
          dependantFields: ["email", "tel"],
        });

        return updateContact({
          variables: { input: dirtyData },
          optimisticResponse: createOptimisticResponse(updateResponseSchema, data),
        });
      }
      // Create contact
      createContact({
        variables: { input: data },
        optimisticResponse: createOptimisticResponse(createResponseSchema, data),
      });
    },
    [getDirtyData, contact, updateContact, createContact]
  );

  return (
    <Loading
      error={!!serverErrors?.networkError || !!serverErrors?.serverError}
      retry={() => submitHandler(getValues())}
    >
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
          <Box
            flex={4}
            display="flex"
            flexDirection="column"
            gap="1.5rem"
            sx={{ overflowY: "scroll", paddingRight: "10px" }}
          >
            <SelectInput
              name="type"
              label="Contact Type"
              placeholder="Select group type..."
              selectItems={["Group", "Online", "Facebook"]}
              setSelectValue={(item) => {
                return item;
              }}
              setDisplayText={(item) => item}
              serverError={serverErrors?.groupType}
              clearServerError={clearServerError}
            />
            {watch("type") === "Group" && (
              <AutoCompleteInput
                name="groupId"
                label="Group"
                options={groups}
                getOptionLabel={({ name }) => name ?? ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}
            <TextInput
              name="name"
              label="Contact Name"
              placeholder="John Doe"
              serverError={serverErrors?.name}
              clearServerError={clearServerError}
            />
            <TextInput
              name="email"
              label="Email Address"
              placeholder="example@example.com"
              serverError={serverErrors?.email}
              clearServerError={clearServerError}
              onChange={() => {
                trigger("tel");
                clearServerError("tel");
              }}
            />

            <TextInput
              name="tel"
              label="Contact Number"
              placeholder="Eg: 076 363 5909"
              serverError={serverErrors?.tel}
              clearServerError={clearServerError}
              onChange={() => {
                trigger("email");
                clearServerError("email");
              }}
            />
          </Box>
          {/* TODO: Add an image to the right for desktop views */}
          {/* <Box flexGrow={1} display="flex">
            {isDesktop && (
              <Box flex={2} display="flex" justifyContent="center" alignItems="center">
                <Image src="https://media.istockphoto.com/id/1250363870/vector/contacts-notebook-phone-book-vector-icon.jpg?s=612x612&w=0&k=20&c=d_XuJuyihx9U1LdK0HPTqTWWqPVHvFkJP4uhKHz46p4=" />
              </Box>
            )}
          </Box> */}

          <Divider
            light
            sx={{
              borderWidth: "1px",
              borderColor: "primary.dark",
              marginTop: "auto",
            }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button type="submit" color="secondary" variant="outlined" onClick={close}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={!isValid || !isDirty}>
              {contact ? "Update" : "Add"} Contact
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Loading>
  );
};

export default ContactForm;
