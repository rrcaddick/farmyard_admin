import { useEffect } from "react";
import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles, Paper } from "@mui/material";
import { useRoutes } from "react-router-dom";
import RouteMap from "@routes";
import { globalStyles } from "src/theme/global-styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getRememberMe } from "@utils/auth";
import useLoading from "@components/loading/use-loading";
import { useAuthenticate } from "@auth/hooks/use-authenticate";
import { hasApolloCache } from "@utils/apollo-cache";
import { useLocation } from "react-router-dom";

const rememberMe = getRememberMe();

const App = () => {
  const [theme, themeMode] = useThemeMode();
  const routes = useRoutes(RouteMap);
  const { login } = useAuthenticate();
  const { Loading, toggleLoading } = useLoading(rememberMe);
  const { pathname } = useLocation();

  useEffect(() => {
    if (rememberMe && !hasApolloCache()) {
      (async () => {
        await login({ rememberMe }, pathname);
        toggleLoading(false);
      })();
    }
    if (hasApolloCache()) {
      toggleLoading(false);
    }
  }, []);

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <GlobalStyles styles={globalStyles} />
          <Loading
            container={
              <Paper
                sx={{
                  borderRadius: "50%",
                  aspectRatio: "1 / 1",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            }
          >
            {routes}
          </Loading>
        </LocalizationProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
