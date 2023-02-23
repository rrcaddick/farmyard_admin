import styled from "@emotion/styled";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, IconButton, TextField, Box, Alert } from "@mui/material";

import { useShowPassword } from "@auth/hooks";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { resetPasswordSchema } from "@auth/schemas/reset-password";
import { useFetch } from "@hooks/use-fetch";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ResetPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 10px;
`;

const ResetPassword = () => {
  const { showPassword, toggleShowPassword, showConfirmPassword, toggleShowConfirmPassword } = useShowPassword();
  const resolver = useYupValidationResolver(resetPasswordSchema);
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm({ resolver, mode: "all" });

  const { userId, token } = useParams();

  const { sendRequest, loading, serverError, success } = useFetch();

  const navigate = useNavigate();

  const resetPasswordHandler = (data) => {
    sendRequest("POST", "/reset-password", { userId, token, ...data });
  };

  useEffect(() => {
    if (success) {
      navigate("/login", { state: { passwordReset: true } });
    }
  }, [success, navigate]);

  return (
    <Box display="flex" justifyContent="center" padding="4rem 2rem">
      <Box
        padding="2rem"
        maxWidth="550px"
        width="100%"
        borderRadius="10px"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        {serverError && (
          <Alert severity="error" sx={{ marginBottom: "2rem", borderRadius: "8px" }}>
            {serverError}
          </Alert>
        )}
        <ResetPasswordForm onSubmit={handleSubmit(resetPasswordHandler)} noValidate>
          <TextField
            variant="standard"
            label="New Password"
            placeholder="P@ssw0rd!2$"
            fullWidth
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <IconButton onClick={toggleShowPassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
            helperText={errors?.newPassword?.message}
            error={Boolean(errors?.newPassword)}
            {...register("newPassword")}
          />
          <TextField
            variant="standard"
            label="Confirm New Password"
            placeholder="P@ssw0rd!2$"
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <IconButton onClick={toggleShowConfirmPassword}>
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
            helperText={errors?.confirmPassword?.message}
            error={Boolean(errors?.confirmPassword)}
            {...register("confirmPassword")}
          />
          <Button
            sx={{ marginTop: "2rem" }}
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!isValid || loading}
          >
            {loading ? "Loading" : "Reset Password"}
          </Button>
        </ResetPasswordForm>
      </Box>
    </Box>
  );
};

export default ResetPassword;
