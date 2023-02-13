import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Login from "./features/auth/login";
import ResetPassword from "./features/auth/reset-password";
import Booking from "./features/booking";
import Dashboard from "./features/dashboard";
import Layout from "./components/layout";
import ProtectedRoutes from "./features/auth/protected-routes";

const App = () => {
  const [theme, themeMode] = useThemeMode();

  const globalStyles = (theme) => ({
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
  });

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={globalStyles} />
        <CssBaseline />
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
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
