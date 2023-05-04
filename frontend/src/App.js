import { useContext, useEffect } from "react";
import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { useRoutes } from "react-router-dom";
import RouteMap from "@routes";
import { useFetch } from "@hooks/use-fetch";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";
import { globalStyles } from "@theme/global-styles";
import { LoadingContext } from "@context/loading";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = ({ rememberMe }) => {
  const [theme, themeMode] = useThemeMode();
  const { sendRequest } = useFetch();
  const cache = useApolloCache();
  const routes = useRoutes(RouteMap);
  const { endLoading } = useContext(LoadingContext);

  // Check for remember me and log in
  useEffect(() => {
    if (rememberMe) {
      (async () => {
        // Attempt login with refresh token
        const response = await sendRequest("POST", "/login", { rememberMe });

        // Write user to apollo cache
        response.success && cache.write(getMe, "User", response.data);
        endLoading();
      })();
    }
  }, [sendRequest, cache, rememberMe, endLoading]);

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <GlobalStyles styles={globalStyles} />
          {routes}
        </LocalizationProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
