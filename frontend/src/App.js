import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { Login, ForgotPassword, ResetPassword, ProtectedRoutes, IsAuthRedirect } from "./features/auth/components";
import Booking from "./features/booking";
import Dashboard from "./features/dashboard";
import Layout from "./components/layout";
import { useEffect, useState } from "react";
import { getRememberMe } from "./utils/auth";
import { useFetch } from "./hooks/use-fetch";
import { useApolloCache } from "./hooks/use-apollo-cache";
import { getMe } from "./features/auth/graphql/queries";

const rememberMe = getRememberMe();

const App = () => {
  const [theme, themeMode] = useThemeMode();

  const [rememberMeLoading, setRememberMeLoading] = useState(rememberMe);
  const { sendRequest } = useFetch();
  const cache = useApolloCache();

  useEffect(() => {
    if (rememberMe) {
      (async () => {
        // Attempt login with refresh token
        const userData = await sendRequest("POST", "/login", { rememberMe });

        // Write user to apollo cache
        cache.write(getMe, "User", userData);
        setRememberMeLoading(false);
      })();
    }
  }, [sendRequest, cache]);

  const globalStyles = (theme) => ({
    html: {
      height: "100%",
      width: "100%",
    },
    body: {
      height: "100%",
      width: "100%",
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

  if (rememberMeLoading) {
    // TODO: Add Lottie loading animation
    return "loading";
  }

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {/* TODO: Refactor use routes object */}
        <Routes>
          {/* Auth */}
          <Route element={<IsAuthRedirect />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          </Route>

          {/* Main App */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/booking" element={<Booking />} />
            </Route>
          </Route>

          {/* Not Found */}
          {/* TODO: Add 404 not found with lottie sheep */}
          <Route path="*" element={"Not found"} />
        </Routes>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
