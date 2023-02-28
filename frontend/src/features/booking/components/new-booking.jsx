import styled from "@emotion/styled";
import ContainedModal from "@components/modal/contained-modal";
import { Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import TextInput from "@components/input/text-input";
import Checkbox from "@components/input/checkbox";

import * as yup from "yup";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";

const testSchema = yup.object({
  fullName: yup.string().required("Please enter a valid full name"),
  email: yup.string().email("Please enter a valid email address").required("Your email address is required"),
});

const Form = styled.form`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
  border-radius: 10px;
`;

const NewBooking = ({ open, close, container }) => {
  const resolver = useYupValidationResolver(testSchema);
  const formMethods = useForm({ resolver, mode: "all" });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <ContainedModal {...{ open, close, container }}>
      <FormProvider {...formMethods}>
        <Form onSubmit={formMethods.handleSubmit(onSubmit)} noValidate>
          <TextInput name="fullName" placeholder="Your your full name" label="Full Name" />
          <TextInput name="email" type="email" placeholder="Your email address" label="Email Address" />
          <Checkbox name="rememberMe" label="Remember Me" onClick={() => {}} />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Form>
      </FormProvider>
    </ContainedModal>
  );
};

export default NewBooking;
