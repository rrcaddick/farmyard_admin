import { useEffect, useState } from "react";
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
  Modal,
} from "@mui/material";
import { useShowPassword } from "../hooks";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useYupValidationResolver } from "../../../hooks/use-yup-validation-resolver";
import { loginSchema } from "../schemas/login";
import { useForm } from "react-hook-form";
import { useFetch } from "../../../hooks/use-fetch";
import { useApolloCache } from "../../../hooks/use-apollo-cache";
import { getMe } from "../graphql/queries";
import { getRememberMe, toggleRememberMe } from "../../../utils/auth";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-radius: 10px;
`;

const Login = () => {
  const colors = useColors();
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
  } = useForm({ resolver, mode: "all", defaultValues: { email: "rrcaddick@gmail.com", password: "Whatever123" } });

  const { sendRequest, loading, serverError, success } = useFetch();

  const cache = useApolloCache();

  const rememberMeHandler = () => {
    toggleRememberMe();
    setRememberMe((x) => !x);
  };

  const loginHandler = async (loginData) => {
    const userData = await sendRequest("POST", "/login", loginData);

    // Write user to apollo cache
    cache.write(getMe, "User", userData);
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
        {navigateState?.passwordReset && (
          <Alert severity="success" sx={{ marginBottom: "2rem", borderRadius: "8px" }}>
            Password updated
          </Alert>
        )}
        {navigateState?.forgotPassword && (
          <Alert severity="success" sx={{ marginBottom: "2rem", borderRadius: "8px" }}>
            A password reset link has been sent to {navigateState.forgotPassword}
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
            <FormControlLabel
              control={<Checkbox onClick={rememberMeHandler} checked={rememberMe} {...register("rememberMe")} />}
              label="Remember me"
            />
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
      {/* TODO: Refactor modal to seperate component. Style using theme */}
      <Modal open={modalOpen}>
        <Box display="flex" justifyContent="space-around" alignItems="center" backgroundColor="red">
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            A logout error occurred. If you are on a public computer, we recommend clearing your browser cookies to keep
            your data safe
          </Typography>
          <Button variant="contained" onClick={() => setModalOpen(false)}>
            Okay
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Login;
