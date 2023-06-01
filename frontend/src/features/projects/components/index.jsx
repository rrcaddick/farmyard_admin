import { Box, Button, IconButton } from "@mui/material";
import Header from "@components/display/header";
import styled from "@emotion/styled";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import TextInput from "@components/input/text-input";
import { object, string, array } from "yup";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Form = styled.form`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
`;

const contactSchema = object().shape({
  name: string().required("Contact name is required"),
  email: string().email("Invalid email address").required("Email address is required"),
  tel: string().required("Contact number is required"),
});

const groupSchema = object().shape({
  name: string().required("Group name is required"),
  contacts: array().of(contactSchema),
});

const Projects = () => {
  const resolver = useYupValidationResolver(groupSchema);
  const formMethods = useForm({ resolver, mode: "all" });
  const { handleSubmit, control } = formMethods;

  const { fields, prepend, remove } = useFieldArray({ name: "contacts", control });

  const submitHandler = (data) => {
    console.log(data);
  };

  return (
    <Box display="flex" flexDirection="column" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit(submitHandler)} noValidate>
          <TextInput variant="outlined" name="name" label="Group Name" placeholder="Eg: Chirst Church" />
          <Button
            type="button"
            variant="contained"
            color="secondary"
            onClick={() => prepend()}
            sx={{ alignSelf: "flex-start" }}
          >
            <AddIcon />
            Add Contacts
          </Button>
          <Box display="flex" flexDirection="column" gap="1rem" overflow="auto">
            {fields.map((field, index) => (
              <Box display="flex" alignItems="center" gap="1rem" key={field.id}>
                <TextInput
                  variant="outlined"
                  name={`contacts[${index}].name`}
                  label="Contact Name"
                  placeholder="John Doe"
                  fullWidth
                />
                <TextInput
                  variant="outlined"
                  name={`contacts[${index}].email`}
                  label="Email Address"
                  placeholder="example@example.com"
                  fullWidth
                />
                <TextInput
                  variant="outlined"
                  name={`contacts[${index}].tel`}
                  label="Tel"
                  placeholder="073 123 4567"
                  fullWidth
                />

                <IconButton type="button" onClick={() => remove(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Button type="submit">Add Group</Button>
        </Form>
      </FormProvider>
    </Box>
  );
};

export default Projects;
