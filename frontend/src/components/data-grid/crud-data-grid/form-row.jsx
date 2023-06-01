import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { Box } from "@mui/material";
import { GridRow } from "@mui/x-data-grid";
import { useForm, FormProvider } from "react-hook-form";

const FormRow = (props) => {
  const {
    schema,
    row: { id, idNew, ...data },
  } = props;

  const resolver = useYupValidationResolver(schema);
  const formMethods = useForm({ resolver, mode: "all", defaultValues: data });

  return (
    <FormProvider {...formMethods}>
      <Box>
        <GridRow {...props} />
      </Box>
    </FormProvider>
  );
};

export default FormRow;
