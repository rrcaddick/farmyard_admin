import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { GridRow } from "@mui/x-data-grid";
import { useForm, FormProvider } from "react-hook-form";

const FormRow = (props) => {
  const { schema } = props;
  const resolver = useYupValidationResolver(schema);
  const formMethods = useForm({ resolver, mode: "all" });
  const { handleSubmit } = formMethods;

  const submitHandler = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...formMethods}>
      <form noValidate onSubmit={handleSubmit(submitHandler)}>
        <GridRow {...props} />
      </form>
    </FormProvider>
  );
};

export default FormRow;
