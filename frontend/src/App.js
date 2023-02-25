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
        const userData = await sendRequest("POST", "/login", { rememberMe });

        // Write user to apollo cache
        userData && cache.write(getMe, "User", userData);
        endLoading();
      })();
    }
  }, [sendRequest, cache, rememberMe, endLoading]);

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        {routes}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
