import _ from "lodash";
import TextInput from "@components/input/text-input";
import SelectInput from "@components/input/select-input";
import { useCallback, useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { newGroupSchema } from "@groups/schemas/new-group";
import { createResponseSchema, updateResponseSchema } from "@groups/schemas/graphql-responses";
import { Box, Button, IconButton, Divider, useTheme, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { generateTempId } from "@graphql/utils/generate-temp-id";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useIsDesktop } from "@hooks/use-is-desktop";
import { useManageDirtyValues } from "@hooks/use-manage-dirty-values";
import { useModalContext } from "@components/modal/use-modal";
import { useGroup } from "@groups/hooks/use-group";
import useLoading from "@components/loading/use-loading";
import { createOptimisticResponse } from "@graphql/utils/create-optimistic-response";
import PhoneNumberInputMask from "@components/input/phone-number-input-mask";

const GroupForm = ({ groupTypes }) => {
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  const {
    close,
    openContext: { group },
  } = useModalContext();

  const formMethods = useForm({
    resolver: useYupValidationResolver(newGroupSchema),
    mode: "all",
    defaultValues: group,
  });

  const {
    handleSubmit,
    reset,
    control,
    setFocus,
    getValues,
    trigger,
    formState: { isValid, isDirty },
  } = formMethods;
  const { fields, append, remove } = useFieldArray({ name: "contacts", control });
  const { getDirtyData, markAsDeleted, hasDeletedItems } = useManageDirtyValues();

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onComplete = useCallback(() => {
    reset();
    close();
  }, [reset, close]);

  const { createGroup, updateGroup, loading, serverErrors, clearServerError } = useGroup({
    onCreateComplete: onComplete,
    onUpdateComplete: onComplete,
  });

  const { Loading } = useLoading(loading);

  const submitHandler = useCallback(
    (data) => {
      const _data =
        typeof data?.groupType === "string" && data?.groupType !== ""
          ? { ...data, groupType: JSON.parse(data.groupType) }
          : data;

      const getInputData = (_data) => {
        const { groupType: { __typename, price: { id } = {}, ...groupType } = {}, contacts } = _data;

        return {
          ..._data,
          ...(contacts && {
            contacts: contacts.map((contact) => {
              // Untouched contact used to keep index
              if (!contact) return null;

              const { id, tel, ...contactData } = contact;

              // Stupid bug fix because yup won't transform tel the same as email
              return id?.includes("Temp")
                ? { ...contactData, ...(tel && { tel: tel ?? undefined }) }
                : { ...contact, ...(tel && { tel: tel ?? undefined }) };
            }),
          }),
          ...(!_.isEmpty(groupType) && { groupType: { ...groupType, price: id } }),
        };
      };

      if (group) {
        const stringfySelectObjects = (submittedData) => {
          const { groupType, ...groupData } = submittedData;
          return { ...groupData, groupType: JSON.stringify(groupType) };
        };

        const dirtyData = getDirtyData(group, _data, {
          dirtyFieldsModifier: stringfySelectObjects,
          withId: true,
          dependantFields: {
            contacts: ["email", "tel"],
          },
        });

        updateGroup({
          variables: { input: getInputData(dirtyData) },
          optimisticResponse: createOptimisticResponse(updateResponseSchema, _data),
        });
      }

      if (!group) {
        createGroup({
          variables: { input: getInputData(_data) },
          optimisticResponse: createOptimisticResponse(createResponseSchema, _data),
        });
      }
    },
    [group, createGroup, updateGroup, getDirtyData]
  );

  const removeContactHandler = (contactIndex) => {
    const deletedContact = { ...getValues(`contacts[${contactIndex}]`), shouldDelete: true };
    markAsDeleted("contacts", deletedContact);
    remove(contactIndex);
  };

  const parseFormValues = useCallback((values) => {
    const { postCode } = values?.address || {};
    return postCode ? { ...values, address: { ...values.address, postCode: Number(postCode) } } : values;
  }, []);

  return (
    <Loading
      error={!!serverErrors?.networkError || !!serverErrors?.serverError}
      retry={() => submitHandler(parseFormValues(getValues()))}
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
          {/* Form Grid */}
          <Grid container spacing={{ xs: 2, md: 4 }} sx={{ overflowY: "scroll", margin: 0 }}>
            <Grid xs={12} md={6}>
              <TextInput
                name="name"
                label="Group Name"
                placeholder="Eg: Chirst Church"
                serverError={serverErrors?.name}
                clearServerError={clearServerError}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <SelectInput
                name="groupType"
                label="Group Type"
                placeholder="Select group type..."
                selectItems={groupTypes}
                setSelectValue={(item) => JSON.stringify(item)}
                setDisplayText={(item) => item.type}
                serverError={serverErrors?.groupType}
                clearServerError={clearServerError}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <TextInput
                name="address.street"
                label="Street"
                placeholder="Eg: 123 Example Street"
                serverError={serverErrors?.["address.street"]}
                clearServerError={clearServerError}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <Box display="flex" gap="2rem" flexGrow={1}>
                <TextInput
                  name="address.suburb"
                  label="Suburb"
                  placeholder="Eg: Bellville"
                  serverError={serverErrors?.["address.suburb"]}
                  clearServerError={clearServerError}
                />
                <TextInput
                  type="number"
                  name="address.postCode"
                  label="Post Code"
                  placeholder="Eg: 7625"
                  serverError={serverErrors?.["address.postCode"]}
                  clearServerError={clearServerError}
                />
              </Box>
            </Grid>

            <Grid xs={12}>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={() =>
                  append(
                    { id: generateTempId("Contact") },
                    { shouldFocus: true, focusName: `contacts[${fields.length}].name` }
                  )
                }
                sx={{ alignSelf: "flex-start" }}
              >
                <AddIcon />
                Add Contacts
              </Button>
            </Grid>

            {fields.map((field, index) => {
              return (
                <Grid xs={12} key={field.id}>
                  <Box display="flex" flexDirection={isDesktop ? "row" : "column"} gap="1rem">
                    <TextInput
                      name={`contacts[${index}].name`}
                      label="Contact Name"
                      placeholder="John Doe"
                      serverError={serverErrors?.[`contacts[${index}].name`]}
                      clearServerError={clearServerError}
                    />
                    <TextInput
                      name={`contacts[${index}].email`}
                      label="Email Address"
                      placeholder="example@example.com"
                      serverError={serverErrors?.[`contacts[${index}].email`]}
                      clearServerError={clearServerError}
                      onChange={() => {
                        const telInput = `contacts[${index}].tel`;
                        trigger(telInput);
                        clearServerError(telInput);
                      }}
                    />
                    <TextInput
                      name={`contacts[${index}].tel`}
                      label="Tel"
                      placeholder="73 123 4567"
                      serverError={serverErrors?.[`contacts[${index}].tel`]}
                      clearServerError={clearServerError}
                      InputProps={{
                        inputComponent: PhoneNumberInputMask,
                      }}
                      onChange={() => {
                        const emailInput = `contacts[${index}].email`;
                        trigger(emailInput);
                        clearServerError(emailInput);
                      }}
                    />

                    {!isDesktop && (
                      <Button type="button" onClick={removeContactHandler.bind(this, index, field.id)}>
                        <DeleteIcon /> Remove Contact
                      </Button>
                    )}

                    {isDesktop && (
                      <IconButton
                        type="button"
                        onClick={removeContactHandler.bind(this, index, field.id)}
                        sx={{ alignSelf: "flex-start", marginTop: "18px", color: "error.light" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          <Divider
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
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={(!isValid || !isDirty || loading) && !hasDeletedItems}
            >
              {group ? "Update" : "Add"} Group
            </Button>
          </Box>
        </Box>
      </FormProvider>
    </Loading>
  );
};

export default GroupForm;
