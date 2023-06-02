import styled from "@emotion/styled";
import TextInput from "@components/input/text-input";
import SelectInput from "@components/input/select-input";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { newGroupSchema } from "@groups/schemas/new-group";
import { Box, Button, IconButton, TextField, Paper, Divider, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useGetAllGroupTypes } from "@groups/graphql/hooks";
import { useCreateGroup } from "@groups/graphql/hooks/use-create-group";
import { generateTempId } from "@graphql/utils/generate-temp-id";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useIsDesktop } from "@hooks/use-is-desktop";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  gap: 2rem;
  padding-top: 10px;
`;

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

const GroupForm = ({ onClose }) => {
  // Load drop down options
  const { groupTypes, loading, error } = useGetAllGroupTypes();
  const groupTypeSelectOptions = useMemo(() => createGroupTypeSelectOptions(groupTypes), [groupTypes]);
  const theme = useTheme();
  const isDesktop = useIsDesktop();

  const { mutate: createGroup, loading: createGroupLoading, serverErrors, clearServerError } = useCreateGroup();

  const resolver = useYupValidationResolver(newGroupSchema);
  const formMethods = useForm({ resolver, mode: "all" });

  const {
    handleSubmit,
    reset,
    control,
    setFocus,
    formState: { isValid },
  } = formMethods;
  const { fields, append, remove } = useFieldArray({ name: "contacts", control });

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const submitHandler = useCallback(
    ({ groupType: groupTypeId, address, contacts, ...data }) => {
      const {
        id,
        type,
        price: { id: price },
      } = groupTypes.find(({ id }) => id === groupTypeId) || { id: "", type: "", price: { id: "" } };

      const groupType = { id, type, price };
      const group = { ...data, groupType: { id, type, price }, address, contacts };

      createGroup({
        variables: { input: group },
        optimisticResponse: {
          createGroup: {
            __typename: "Group",
            id: generateTempId("Group"),
            ...data,
            groupType: {
              __typename: "GroupType",
              ...{ ...groupType, price: { id: price } },
            },
            address: {
              __typename: "Address",
              ...address,
            },
            contacts: [
              ...contacts.map((contact) => ({ __typename: "Contact", id: generateTempId("Contact"), ...contact })),
            ],
          },
        },
      });

      reset();
      onClose();
    },
    [createGroup, onClose, groupTypes, reset]
  );

  //TODO: Intercept next button on mobile and add select to next order

  return (
    <>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(submitHandler)} noValidate>
          {/* Form Grid */}
          <Grid container spacing={{ xs: 2, md: 4 }} sx={{ overflowY: "scroll", margin: 0 }}>
            <Grid xs={12} md={6}>
              <TextInput
                variant="standard"
                name="name"
                label="Group Name"
                placeholder="Eg: Chirst Church"
                fullWidth
                InputProps={{ inputProps: { tabIndex: 1 } }}
                serverError={serverErrors?.name}
                //TODO: Think of way to add this to the TextInput component
                {...(serverErrors?.name && {
                  onChange: ({ target }) => {
                    clearServerError(target?.name);
                  },
                })}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <SelectInput
                variant="standard"
                inputLabelProps={{ sx: { margin: 0 } }}
                name="groupType"
                label="Group Type"
                placeholder="Select group type..."
                selectItems={groupTypeSelectOptions}
                formControlProps={{ sx: { width: "100%" } }}
                serverError={serverErrors?.groupType}
                {...(serverErrors?.groupType && {
                  onChange: ({ target }) => {
                    clearServerError(target?.name);
                  },
                })}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <TextInput
                variant="standard"
                name="address.street"
                label="Street"
                placeholder="Eg: 123 Example Street"
                fullWidth
                serverError={serverErrors?.["address.street"]}
                {...(serverErrors?.["address.street"] && {
                  onChange: ({ target }) => {
                    clearServerError(target?.name);
                  },
                })}
              />
            </Grid>

            <Grid xs={12} md={6}>
              <Box display="flex" gap="2rem" flexGrow={1}>
                <TextInput
                  variant="standard"
                  name="address.suburb"
                  label="Suburb"
                  placeholder="Eg: Bellville"
                  sx={{ flexGrow: 1 }}
                  serverError={serverErrors?.["address.suburb"]}
                  {...(serverErrors?.["address.suburb"] && {
                    onChange: ({ target }) => {
                      clearServerError(target?.name);
                    },
                  })}
                />
                <TextInput
                  variant="standard"
                  type="number"
                  name="address.postCode"
                  label="Post Code"
                  placeholder="Eg: 7625"
                  sx={{ flexGrow: 1 }}
                  serverError={serverErrors?.["address.postCode"]}
                  {...(serverErrors?.["address.postCode"] && {
                    onChange: ({ target }) => {
                      clearServerError(target?.name);
                    },
                  })}
                />
              </Box>
            </Grid>

            <Grid xs={12}>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                onClick={() => append({}, { shouldFocus: true, focusName: `contacts[${fields.length}].name` })}
                sx={{ alignSelf: "flex-start" }}
              >
                <AddIcon />
                Add Contacts
              </Button>
            </Grid>

            {fields.map((field, index) => (
              <Grid xs={12} key={field.id}>
                <Box display="flex" flexDirection={isDesktop ? "row" : "column"} gap="1rem">
                  <TextInput
                    variant="standard"
                    name={`contacts[${index}].name`}
                    label="Contact Name"
                    placeholder="John Doe"
                    fullWidth
                    serverError={serverErrors?.[`contacts[${index}].name`]}
                    {...(serverErrors?.[`contacts[${index}].name`] && {
                      onChange: ({ target }) => {
                        clearServerError(target?.name);
                      },
                    })}
                  />
                  <TextInput
                    variant="standard"
                    name={`contacts[${index}].email`}
                    label="Email Address"
                    placeholder="example@example.com"
                    fullWidth
                    serverError={serverErrors?.[`contacts[${index}].email`]}
                    {...(serverErrors?.[`contacts[${index}].email`] && {
                      onChange: ({ target }) => {
                        clearServerError(target?.name);
                      },
                    })}
                  />
                  <TextInput
                    variant="standard"
                    name={`contacts[${index}].tel`}
                    label="Tel"
                    placeholder="073 123 4567"
                    fullWidth
                    serverError={serverErrors?.[`contacts[${index}].tel`]}
                    {...(serverErrors?.[`contacts[${index}].tel`] && {
                      onChange: ({ target }) => {
                        clearServerError(target?.name);
                      },
                    })}
                  />

                  {!isDesktop && (
                    <Button type="button" onClick={() => remove(index)}>
                      <DeleteIcon /> Remove Contact
                    </Button>
                  )}

                  {isDesktop && (
                    <IconButton
                      type="button"
                      onClick={() => remove(index)}
                      sx={{ alignSelf: "flex-start", marginTop: "18px", color: "error.light" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
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
            <Button type="submit" color="secondary" onClick={onClose}>
              Back
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={!isValid}>
              Add Group
            </Button>
          </Box>
        </Form>
      </FormProvider>
    </>
  );
};

export default GroupForm;
