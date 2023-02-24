import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, TextField, Alert } from "@mui/material";

import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { forgotPasswordSchema } from "@auth/schemas/forgot-password";
import { useFetch } from "@hooks/use-fetch";

import ForgotPasswordForm from "@auth/components/auth-form";

const ForgotPassword = () => {
  const resolver = useYupValidationResolver(forgotPasswordSchema);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { isValid, errors },
  } = useForm({ resolver, mode: "all", defaultValues: { email: "rrcaddick@gmail.com" } });

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
      <ForgotPasswordForm onSubmit={handleSubmit(sendLinkHandler)} noValidate>
        <TextField
          variant="standard"
          label="Email Address"
          placeholder="example@example.com"
          fullWidth
          type="email"
          helperText={errors?.email?.message}
          error={Boolean(errors?.email)}
          {...register("email")}
        />
        <Button variant="contained" type="submit" sx={{ mt: "1rem" }} disabled={!isValid || loading}>
          {loading ? "Loading" : "Send Password Reset"}
        </Button>
      </ForgotPasswordForm>
    </>
  );
};

export default ForgotPassword;
