import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles, Paper } from "@mui/material";
import { useRoutes } from "react-router-dom";
import RouteMap from "@routes";
import { globalStyles } from "src/theme/global-styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getRememberMe } from "@utils/auth";
import useLoading from "@components/loading/use-loading";
import { useQuery } from "@apollo/client";
import { GET_ME } from "@auth/graphql/queries";
import { useEffect } from "react";
import { hasApolloCache } from "@utils/apollo-cache";

const rememberMe = getRememberMe();

const App = () => {
  const [theme, themeMode] = useThemeMode();
  const routes = useRoutes(RouteMap);

  const { loading } = useQuery(GET_ME, {
    fetchPolicy: "network-only",
    skip: hasApolloCache() || !rememberMe, // Skips the query cache is available or rememberMe is false
  });

  useEffect(() => {
    if (hasApolloCache()) {
    }
  });

  const { Loading } = useLoading(loading);

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
