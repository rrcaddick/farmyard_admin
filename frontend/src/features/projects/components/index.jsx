import { Box, Button } from "@mui/material";
import Header from "@components/display/header";
import { FormProvider, useForm } from "react-hook-form";
import AutoCompleteInput from "@components/input/auto-complete-input";
import { useApolloQuery } from "@hooks/use-apollo-query";
import { GET_GROUPS } from "@groups/graphql/queries";

const Projects = () => {
  const submitHandler = (formData) => {
    console.log(formData);
  };
  const formMethods = useForm();
  const { handleSubmit } = formMethods;

  const { data: groups } = useApolloQuery(GET_GROUPS);

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      <FormProvider {...formMethods}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(submitHandler)}
          display="flex"
          flexDirection="column"
          flexGrow={1}
          gap="2rem"
        >
          <AutoCompleteInput
            name="groupId"
            label="Group"
            options={groups}
            getOptionLabel={({ name }) => name ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default Projects;
