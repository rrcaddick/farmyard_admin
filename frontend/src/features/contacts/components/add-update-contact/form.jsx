import TextInput from "@components/input/text-input";
import SelectInput from "@components/input/select-input";
import { useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { contactSchema } from "@contacts/schemas/contact-schema";
import { Box, Button, Divider, InputAdornment } from "@mui/material";
import { useModalContext } from "@components/modal/use-modal";
import { useContact } from "@contacts/hooks/use-contact";
import { useManageDirtyValues } from "@hooks/use-manage-dirty-values";
import { createOptimisticResponse } from "@graphql/utils/create-optimistic-response";
import { createResponseSchema, updateResponseSchema } from "@contacts/schemas/graphql-responses";
import useLoading from "@components/loading/use-loading";
import AutoCompleteInput from "@components/input/auto-complete-input";
import PhoneNumberInputMask from "@components/input/phone-number-input-mask";

const ContactForm = ({ groups, contactTypes }) => {
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
    getValues,
    watch,
    trigger,
    formState: { isValid, isDirty },
  } = formMethods;

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
          // TODO: Change to dirtyFieldsOveride object {email: 1, tel: 1}
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
              selectItems={contactTypes}
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
                getOptionValue={(options, value) => options.find((x) => x.id === value) ?? ""}
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
              placeholder="071 234 5678"
              serverError={serverErrors?.tel}
              clearServerError={clearServerError}
              InputProps={{
                startAdornment: (
                  <InputAdornment sx={{ marginBottom: "1px" }} position="start">
                    +27(0)
                  </InputAdornment>
                ),
                inputComponent: PhoneNumberInputMask,
              }}
              onChange={async () => {
                trigger("email");
                clearServerError("email");
              }}
            />
          </Box>

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
