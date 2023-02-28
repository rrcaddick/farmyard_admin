import styled from "@emotion/styled";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { Button, IconButton, Box, Typography, Alert } from "@mui/material";

import LogoutError from "@auth/components/logout-error";
import Checkbox from "@components/input/checkbox";

import { useShowPassword } from "@auth/hooks";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { loginSchema } from "@auth/schemas/login";
import { useForm, FormProvider } from "react-hook-form";
import { useFetch } from "@hooks/use-fetch";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";
import { getRememberMe, toggleRememberMe } from "@utils/auth";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TextInput from "@components/input/text-input";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 10px;
`;

const Login = () => {
  const navigate = useNavigate();
  const { state: navigateState } = useLocation();
  const [modalOpen, setModalOpen] = useState(Boolean(navigateState?.logoutError));

  const { showPassword, toggleShowPassword } = useShowPassword();
  const resolver = useYupValidationResolver(loginSchema);

  const formMethods = useForm({
    resolver,
    mode: "all",
    defaultValues: { email: "rrcaddick@gmail.com", password: "Fr33l0ader!@)(", rememberMe: getRememberMe() },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = formMethods;

  const { sendRequest, loading, serverError, success } = useFetch();

  const cache = useApolloCache();

  const rememberMeHandler = useCallback(() => {
    toggleRememberMe();
  }, []);

  const loginHandler = useCallback(
    async (loginData) => {
      const response = await sendRequest("POST", "/login", loginData);

      // Write user to apollo cache
      response.success && cache.write(getMe, "User", response.data);
    },
    [sendRequest, cache]
  );

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success, navigate]);

  return (
    <>
      {serverError && (
        <Alert severity="error" sx={{ borderRadius: "8px" }}>
          {serverError}
        </Alert>
      )}
      {navigateState?.passwordReset && (
        <Alert severity="success" sx={{ borderRadius: "8px" }}>
          Password updated
        </Alert>
      )}
      {navigateState?.forgotPassword && (
        <Alert severity="success" sx={{ borderRadius: "8px" }}>
          A password reset link has been sent to {navigateState.forgotPassword}
        </Alert>
      )}
      <Box>
        <Typography
          variant="h2"
          sx={(theme) => ({
            [theme.breakpoints.down("md")]: {
              fontSize: "48px",
            },
          })}
          textAlign="center"
          fontWeight={700}
        >
          FARMYARD ADMIN
        </Typography>
      </Box>
      <FormProvider {...formMethods}>
        <LoginForm onSubmit={handleSubmit(loginHandler)} noValidate>
          <TextInput name="email" label="Email Address" type="email" placeholder="example@example.com" />
          <TextInput
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="P@ssw0rd!2$"
            InputProps={{
              endAdornment: (
                <IconButton onClick={toggleShowPassword}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <Checkbox name="rememberMe" label="Remember me" onChange={rememberMeHandler} />

          <Typography textAlign="center">
            <Link to="/forgot-password">Forgot Password?</Link>
          </Typography>

          <Button variant="contained" type="submit" sx={{ mt: "1rem" }} disabled={!isValid || loading}>
            {loading ? "Loading" : "Login"}
          </Button>
        </LoginForm>
      </FormProvider>
      <LogoutError modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

export default Login;
