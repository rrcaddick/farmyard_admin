import styled from "@emotion/styled";
import { useColors } from "../../../theme/hooks/useColors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
import { useShowPassword } from "../hooks";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useYupValidationResolver } from "../../../hooks/useYupValidationResolver";
import { loginSchema } from "../schemas/login";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import { useEffect } from "react";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 10px;
`;

const Login = () => {
  const colors = useColors();
  const { showPassword, toggleShowPassword } = useShowPassword();
  const resolver = useYupValidationResolver(loginSchema);
  const {
    handleSubmit,
    register,
    formState: { isValid, errors },
  } = useForm({ resolver, mode: "all", defaultValues: { email: "rrcaddick@gmail.com", password: "Whatever123" } });

  const { login, loading, serverError, success } = useLogin();

  const navigate = useNavigate();
  const { state } = useLocation();

  const loginHandler = (data) => {
    login(data);
  };

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success, navigate]);

  return (
    <Box display="flex" justifyContent="center" flexGrow={1} padding="4rem 2rem">
      <Box
        padding="2rem"
        maxWidth="550px"
        flexGrow={1}
        backgroundColor={colors.primary[700]}
        borderRadius="10px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {serverError && (
          <Alert severity="error" sx={{ marginBottom: "2rem", borderRadius: "8px" }}>
            {serverError}
          </Alert>
        )}
        {state?.passwordReset && (
          <Alert severity="success" sx={{ marginBottom: "2rem", borderRadius: "8px" }}>
            Password updated
          </Alert>
        )}
        {state?.forgotPassword && (
          <Alert severity="success" sx={{ marginBottom: "2rem", borderRadius: "8px" }}>
            A password reset link has been sent to {state.forgotPassword}
          </Alert>
        )}
        <Box marginBottom="4rem">
          <Typography
            variant="h2"
            sx={(theme) => ({
              [theme.breakpoints.down("md")]: {
                fontSize: "48px",
              },
            })}
            textAlign="center"
            fontWeight={700}
            color={colors.grey[300]}
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
            <FormControlLabel control={<Checkbox {...register("rememberMe")} />} label="Remember me" />
          </FormGroup>

          <Typography
            textAlign="center"
            sx={{
              "&:hover": {
                color: colors.greenAccent[400],
              },
              "&:active": {
                color: colors.greenAccent[600],
              },
            }}
          >
            <Link to="/forgot-password">Forgot Password?</Link>
          </Typography>

          <Button variant="contained" color="secondary" type="submit" disabled={!isValid || loading}>
            {loading ? "Loading" : "Login"}
          </Button>
        </LoginForm>
      </Box>
    </Box>
  );
};

export default Login;