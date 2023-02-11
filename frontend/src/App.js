import { ThemeModeContext, useThemeMode } from "./theme";
import { ThemeProvider, CssBaseline, GlobalStyles, Typography } from "@mui/material";
import Layout from "./components/layout";

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
        <Layout>
          <Typography variant="h1">Test</Typography>
        </Layout>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default App;
