import styled from "@emotion/styled";
import { useColors } from "../../../theme/hooks/useColors";
import { Button, TextField, Box, Alert } from "@mui/material";
import { useYupValidationResolver } from "../../../hooks/use-yup-validation-resolver";
import { forgotPasswordSchema } from "../schemas/forgot-password";
import { useForm } from "react-hook-form";
import { useFetch } from "../../../hooks/use-fetch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 10px;
`;

const ForgotPassword = () => {
  const colors = useColors();
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
    <Box display="flex" justifyContent="center" padding="4rem 2rem">
      <Box
        padding="2rem"
        maxWidth="550px"
        width="100%"
        backgroundColor={colors.primary[700]}
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
          <Button
            sx={{ marginTop: "2rem" }}
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!isValid || loading}
          >
            {loading ? "Loading" : "Send Password Reset"}
          </Button>
        </ForgotPasswordForm>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
