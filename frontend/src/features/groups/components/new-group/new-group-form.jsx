import styled from "@emotion/styled";
import TextInput from "@components/input/text-input";
import SelectInput from "@components/input/select-input";
import { useMemo, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { newGroupSchema } from "@groups/schemas/new-group";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useGetAllGroupTypes } from "@groups/graphql/hooks";
import { useCreateGroup } from "@groups/graphql/hooks/use-create-group";
import { generateTempId } from "@graphql/utils/generate-temp-id";

const Form = styled.form`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
  border-radius: 10px;
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

  const { mutate: createGroup } = useCreateGroup();

  const formRef = useRef();
  const resolver = useYupValidationResolver(newGroupSchema);
  const formMethods = useForm({ resolver, mode: "all" });

  const { handleSubmit, reset } = formMethods;

  const submitHandler = ({ groupType: groupTypeId, street, suburb, postCode, ...data }) => {
    const {
      id,
      type,
      price: { id: price },
    } = groupTypes.find(({ id }) => (id = groupTypeId));

    const groupType = { id, type, price };
    const address = { street, suburb, postCode };
    const group = { ...data, groupType: { id, type, price }, address };

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
        },
      },
    });

    reset();
    onClose();
  };

  return (
    <FormProvider {...formMethods}>
      <Form ref={formRef} onSubmit={handleSubmit(submitHandler)} noValidate>
        <TextInput variant="outlined" name="name" label="Group Name" placeholder="Eg: Chirst Church" />
        <SelectInput
          name="groupType"
          label="Group Type"
          placeholder="Select group type..."
          selectItems={groupTypeSelectOptions}
        />
        <Box display="flex" gap="1rem">
          <TextInput
            variant="outlined"
            name="street"
            label="Street"
            placeholder="Eg: 123 Example Street"
            sx={{ flex: 4 }}
          />
          <TextInput variant="outlined" name="suburb" label="Suburb" placeholder="Eg: Bellville" sx={{ flex: 2 }} />
          <TextInput type="number" variant="outlined" name="postCode" label="Post Code" placeholder="Eg: 7625" />
        </Box>
        <Box></Box>
        <Paper sx={{ display: "flex", gap: "10px", p: "5px" }}>
          <TextInput name="fullName" label="Full Name" placeholder="Eg: Bellville" sx={{ flex: 4 }} />
          <TextInput name="email" label="Email Address" placeholder="Eg: Bellville" sx={{ flex: 4 }} />
          <TextInput name="tel" label="Tel" placeholder="Eg: Bellville" sx={{ flex: 4 }} />
        </Paper>
        <Button type="submit" variant="contained" color="secondary" sx={{ mt: "auto" }}>
          Add New Group
        </Button>
      </Form>
    </FormProvider>
  );
};

export default GroupForm;
