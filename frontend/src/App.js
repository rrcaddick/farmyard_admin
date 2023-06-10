import { useEffect } from "react";
import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { useRoutes } from "react-router-dom";
import RouteMap from "@routes";
import { useFetch } from "@hooks/use-fetch";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";
import { globalStyles } from "@theme/global-styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getRememberMe } from "@utils/auth";
import useLoading from "@components/loading/use-loading";

const rememberMe = getRememberMe();

const App = () => {
  const [theme, themeMode] = useThemeMode();
  const { sendRequest } = useFetch();
  const cache = useApolloCache();
  const routes = useRoutes(RouteMap);
  const { toggleLoading, Loading } = useLoading(rememberMe);

  // Check for remember me and log in
  useEffect(() => {
    if (rememberMe) {
      (async () => {
        // Attempt login with refresh token
        const response = await sendRequest("POST", "/login", { rememberMe });

        // Write user to apollo cache
        response?.success && cache.write(getMe, "User", response.data);
        toggleLoading(false);
      })();
    }
  }, [sendRequest, cache, toggleLoading]);

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <GlobalStyles styles={globalStyles} />
          <Loading>{routes}</Loading>
        </LocalizationProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
