import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Alert } from "@mui/material";

import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { forgotPasswordSchema } from "@auth/schemas/forgot-password";
import { useFetch } from "@hooks/use-fetch";

import ForgotPasswordForm from "@auth/components/auth-form";
import TextInput from "@components/input/text-input";

const ForgotPassword = () => {
  const resolver = useYupValidationResolver(forgotPasswordSchema);
  const formMethods = useForm({ resolver, mode: "all", defaultValues: { email: "rrcaddick@gmail.com" } });

  const {
    handleSubmit,
    getValues,
    formState: { isValid },
  } = formMethods;

  const navigate = useNavigate();

  const { sendRequest, loading, serverError, success } = useFetch();

  const sendLinkHandler = (email) => {
    sendRequest("POST", "/forgot-password", email);
  };

  useEffect(() => {
    if (success) {
      navigate("/login", { state: { forgotPassword: getValues("email") } });
    }
  }, [success, navigate, getValues]);

  return (
    <>
      {serverError && (
        <Alert severity="error" sx={{ borderRadius: "8px" }}>
          {serverError}
        </Alert>
      )}
      <FormProvider {...formMethods}>
        <ForgotPasswordForm onSubmit={handleSubmit(sendLinkHandler)} noValidate>
          <TextInput name="email" type="email" label="Email Address" placeholder="example@example.com" />
          <Button variant="contained" type="submit" sx={{ mt: "1rem" }} disabled={!isValid || loading}>
            {loading ? "Loading" : "Send Password Reset"}
          </Button>
        </ForgotPasswordForm>
      </FormProvider>
    </>
  );
};

export default ForgotPassword;
