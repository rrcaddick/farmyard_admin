import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { Button, IconButton, Alert } from "@mui/material";

import { useShowPassword } from "@auth/hooks";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { resetPasswordSchema } from "@auth/schemas/reset-password";
import useFetch from "@hooks/use-fetch";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import ResetPasswordForm from "@auth/components/auth-form";
import TextInput from "@components/input/text-input";

const ResetPassword = () => {
  const { showPassword, toggleShowPassword, showConfirmPassword, toggleShowConfirmPassword } = useShowPassword();
  const resolver = useYupValidationResolver(resetPasswordSchema);
  const formMethods = useForm({ resolver, mode: "all", defaultValues: { newPassword: "", confirmPassword: "" } });

  const {
    handleSubmit,
    formState: { isValid },
  } = formMethods;

  const { userId, token } = useParams();

  const { sendRequest, loading, serverError, success } = useFetch();

  const navigate = useNavigate();

  const resetPasswordHandler = useCallback(
    (data) => {
      sendRequest("/reset-password", { method: "POST", body: { userId, token, ...data } });
    },
    [sendRequest, userId, token]
  );

  const getInputProps = useCallback(
    (onClick, state) => ({
      endAdornment: <IconButton onClick={onClick}>{state ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton>,
    }),
    []
  );

  useEffect(() => {
    if (success) {
      navigate("/login", { state: { passwordReset: true } });
    }
  }, [success, navigate]);

  return (
    <>
      {serverError && (
        <Alert severity="error" sx={{ borderRadius: "8px" }}>
          {serverError}
        </Alert>
      )}
      <FormProvider {...formMethods}>
        <ResetPasswordForm onSubmit={handleSubmit(resetPasswordHandler)} noValidate>
          <TextInput
            name="newPassword"
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="P@ssw0rd!2$"
            variant="outlined"
            InputProps={getInputProps(toggleShowPassword, showPassword)}
          />
          <TextInput
            name="confirmPassword"
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="P@ssw0rd!2$"
            variant="outlined"
            InputProps={getInputProps(toggleShowConfirmPassword, showConfirmPassword)}
          />
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            sx={{ mt: "1rem" }}
            disabled={!isValid || loading}
          >
            {loading ? "Loading" : "Reset Password"}
          </Button>
        </ResetPasswordForm>
      </FormProvider>
    </>
  );
};

export default ResetPassword;
