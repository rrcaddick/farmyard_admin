import { useEffect, useState } from "react";
import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles, Box } from "@mui/material";
import { useRoutes } from "react-router-dom";
import RouteMap from "@routes";
import { getRememberMe } from "@utils/auth";
import { useFetch } from "@hooks/use-fetch";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";

const rememberMe = getRememberMe();

const App = () => {
  const [theme, themeMode] = useThemeMode();

  const [rememberMeLoading, setRememberMeLoading] = useState(rememberMe);
  const { sendRequest } = useFetch();
  const cache = useApolloCache();

  const routes = useRoutes(RouteMap);

  // Check for remember me and log in
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

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {/* TODO: Refactor use routes object */}
        {rememberMeLoading ? <Box>Loading...</Box> : routes}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
