import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, IconButton, Box, Typography, Alert } from "@mui/material";
import LogoutError from "@auth/components/logout-error";
import Checkbox from "@components/input/checkbox";
import { useShowPassword } from "@auth/hooks";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { loginSchema } from "@auth/schemas/login";
import { useForm, FormProvider } from "react-hook-form";
import { getRememberMe, toggleRememberMe } from "@utils/auth";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TextInput from "@components/input/text-input";
import { useAuthenticate } from "@auth/hooks/use-authenticate";

const Login = () => {
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

  const { login } = useAuthenticate();

  const rememberMeHandler = useCallback(() => {
    toggleRememberMe();
  }, []);

  return (
    <>
      {/* TODO: Don't show login error for failed refresh on start */}
      {!!navigateState?.loginError && (
        <Alert severity="error" sx={{ borderRadius: "8px" }}>
          {navigateState?.loginError}
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
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap="1rem"
          borderRadius="10px"
          onSubmit={handleSubmit(login)}
          noValidate
        >
          <TextInput
            name="email"
            label="Email Address"
            type="email"
            placeholder="example@example.com"
            variant="outlined"
          />
          <TextInput
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="P@ssw0rd!2$"
            variant="outlined"
            // TODO: Add password-input component that has this baked in
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

          <Button variant="contained" type="submit" sx={{ mt: "1rem" }} disabled={!isValid}>
            Login
          </Button>
        </Box>
      </FormProvider>
      {/* TODO: Refactor to use useModal */}
      <LogoutError modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

export default Login;
