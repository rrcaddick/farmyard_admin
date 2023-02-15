import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { Login, ForgotPassword, ResetPassword, ProtectedRoutes } from "./features/auth/components";
import Booking from "./features/booking";
import Dashboard from "./features/dashboard";
import Layout from "./components/layout";

const App = () => {
  const [theme, themeMode] = useThemeMode();

  const globalStyles = (theme) => ({
    html: {
      height: "100%",
      width: "100%",
    },
    body: {
      height: "100%",
      width: "100%",
      backgroundColor: "red",
    },
    "#root": {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    },
    "::-webkit-scrollbar": {
      width: "10px",
    },
    "::-webkit-scrollbar-track": {
      background: "#e0e0e0",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#888",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    a: {
      textDecoration: "none",
      color: "inherit",
    },
    "a:hover": {
      textDecoration: "underline",
    },
    "a:visited": {
      color: "inherit",
    },
    "a:active": {
      color: "inherit",
    },
  });

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={globalStyles} />
        <CssBaseline />
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          {/* Main App */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/booking" element={<Booking />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
