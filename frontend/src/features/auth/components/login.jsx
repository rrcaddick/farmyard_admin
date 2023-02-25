import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import {
  Button,
  IconButton,
  TextField,
  Box,
  Typography,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import LogoutError from "@auth/components/logout-error";

import { useShowPassword } from "@auth/hooks";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { loginSchema } from "@auth/schemas/login";
import { useForm } from "react-hook-form";
import { useFetch } from "@hooks/use-fetch";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";
import { getRememberMe, toggleRememberMe } from "@utils/auth";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 10px;
`;

const Login = () => {
  const navigate = useNavigate();
  const { state: navigateState } = useLocation();

  const [rememberMe, setRememberMe] = useState(getRememberMe());
  const [modalOpen, setModalOpen] = useState(Boolean(navigateState?.logoutError));

  const { showPassword, toggleShowPassword } = useShowPassword();
  const resolver = useYupValidationResolver(loginSchema);
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm({ resolver, mode: "all", defaultValues: { email: "rrcaddick@gmail.com", password: "Fr33l0ader!@)(" } });

  const { sendRequest, loading, serverError, success } = useFetch();

  const cache = useApolloCache();

  const rememberMeHandler = () => {
    toggleRememberMe();
    setRememberMe((x) => !x);
  };

  const loginHandler = async (loginData) => {
    const response = await sendRequest("POST", "/login", loginData);

    // Write user to apollo cache
    response.success && cache.write(getMe, "User", response.data);
  };

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
      <LoginForm onSubmit={handleSubmit(loginHandler)} noValidate>
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
        <TextField
          variant="standard"
          label="Password"
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
          helperText={errors?.password?.message}
          error={Boolean(errors?.password)}
          {...register("password")}
        />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox onClick={rememberMeHandler} checked={rememberMe} {...register("rememberMe")} />}
            label="Remember me"
          />
        </FormGroup>

        <Typography textAlign="center">
          <Link to="/forgot-password">Forgot Password?</Link>
        </Typography>

        <Button variant="contained" type="submit" sx={{ mt: "1rem" }} disabled={!isValid || loading}>
          {loading ? "Loading" : "Login"}
        </Button>
      </LoginForm>
      <LogoutError modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
};

export default Login;
