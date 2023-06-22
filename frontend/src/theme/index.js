import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { createBreakpoints } from "@mui/system";
import _ from "lodash";
import { addHexOpacity } from "@utils/style";

const breakpoints = createBreakpoints({});

const getUserModePreference = () => {
  const mode = localStorage.getItem("themeMode");

  const { matches: isDarkMode } = window.matchMedia("(prefers-color-scheme: dark)");
  if (!mode) localStorage.setItem("themeMode", isDarkMode ? "dark" : "light");

  return localStorage.getItem("themeMode");
};

export const getColors = (mode) => {
  return {
    ...(mode === "dark"
      ? {
          grey: {
            100: "#e0e0e0",
            200: "#c2c2c2",
            300: "#a3a3a3",
            400: "#858585",
            500: "#666666",
            600: "#525252",
            700: "#3d3d3d",
            800: "#292929",
            900: "#141414",
          },
          primary: {
            100: "#d0d1d5",
            200: "#a1a4ab",
            300: "#727681",
            400: "#1F2A40",
            500: "#141b2d",
            600: "#101624",
            700: "#0c101b",
            800: "#080b12",
            900: "#040509",
          },
          greenAccent: {
            100: "#dbf5ee",
            200: "#b7ebde",
            300: "#94e2cd",
            400: "#70d8bd",
            500: "#4cceac",
            600: "#3da58a",
            700: "#2e7c67",
            800: "#1e5245",
            900: "#0f2922",
          },
          redAccent: {
            100: "#f8dcdb",
            200: "#f1b9b7",
            300: "#e99592",
            400: "#e2726e",
            500: "#db4f4a",
            600: "#af3f3b",
            700: "#832f2c",
            800: "#58201e",
            900: "#2c100f",
          },
          blueAccent: {
            100: "#e1e2fe",
            200: "#c3c6fd",
            300: "#a4a9fc",
            400: "#868dfb",
            500: "#6870fa",
            600: "#535ac8",
            700: "#3e4396",
            800: "#2a2d64",
            900: "#151632",
          },
        }
      : {
          grey: {
            100: "#141414",
            200: "#292929",
            300: "#3d3d3d",
            400: "#525252",
            500: "#666666",
            600: "#858585",
            700: "#a3a3a3",
            800: "#c2c2c2",
            900: "#e0e0e0",
          },
          primary: {
            main: "red",
            100: "#040509",
            200: "#080b12",
            300: "#0c101b",
            400: "#f2f0f0",
            500: "#141b2d",
            600: "#434957",
            700: "#727681",
            800: "#a1a4ab",
            900: "#d0d1d5",
          },
          greenAccent: {
            100: "#0f2922",
            200: "#1e5245",
            300: "#2e7c67",
            400: "#3da58a",
            500: "#4cceac",
            600: "#70d8bd",
            700: "#94e2cd",
            800: "#b7ebde",
            900: "#dbf5ee",
          },
          redAccent: {
            100: "#2c100f",
            200: "#58201e",
            300: "#832f2c",
            400: "#af3f3b",
            500: "#db4f4a",
            600: "#e2726e",
            700: "#e99592",
            800: "#f1b9b7",
            900: "#f8dcdb",
          },
          blueAccent: {
            100: "#151632",
            200: "#2a2d64",
            300: "#3e4396",
            400: "#535ac8",
            500: "#6870fa",
            600: "#868dfb",
            700: "#a4a9fc",
            800: "#c3c6fd",
            900: "#e1e2fe",
          },
        }),
  };
};

export const themeSettings = (mode) => {
  const primaryFont = "Source Sans Pro";

  const colors =
    mode === "dark"
      ? {
          palette: {
            mode,
            primary: {
              main: "#70d8bd",
            },
            secondary: {
              main: "#70c0d8",
            },
            error: {
              main: "#d32f2f",
            },
            background: {
              default: "#141b2d",
              paper: "#141b2d",
            },
            text: {
              primary: "#e0e0e0",
            },
          },
        }
      : {
          palette: {
            mode,
            primary: {
              main: "#009687",
            },
            secondary: {
              main: "#004b79",
            },
            error: {
              main: "#d32f2f",
            },
            background: {
              default: "#ececec",
              paper: "#ffffff",
            },
            text: {
              primary: "#222",
            },
          },
        };

  const themeSettings = {
    ...colors,
    ...(mode === "dark"
      ? {}
      : {
          components: {
            MuiIconButton: {
              styleOverrides: {
                root: ({ ownerState }) => ({
                  ...(ownerState.color === "top-bar" && { color: "#fff" }),
                }),
              },
            },
          },
        }),
  };

  const globalSetting = {
    typography: {
      allVariants: {
        fontFamily: `'${primaryFont}', sans-serif`,
      },
    },
    components: {
      MuiDateCalendar: {
        styleOverrides: {
          root: { margin: 0, width: "100%", height: "100%" },
        },
      },
      MUIDataTable: {
        styleOverrides: {
          tableRoot: ({ loading, error }) => ({
            ...((loading || error) && {
              height: "100%",
            }),
          }),
          root: {
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          },
          responsiveBase: ({ loading, error }) => ({
            ...((loading || error) && {
              height: "100% !important",
            }),
            overflow: "auto",
          }),
        },
      },
      MUIDataTableBody: {
        styleOverrides: {
          emptyTitle: {
            [breakpoints.down("md")]: {
              textAlign: "right",
            },
          },
        },
      },
      MUIDataTableToolbar: {
        styleOverrides: {
          root: {
            minHeight: "inherit",
            padding: "8px 15px",
            [breakpoints.down("sm")]: {
              margin: "0 auto",
            },
          },
        },
      },
      MUIDataTableSearch: {
        styleOverrides: {
          main: {
            [breakpoints.down("sm")]: {
              justifyContent: "space-between",
            },
          },
        },
      },
      MUIDataTableToolbarSelect: {
        styleOverrides: {
          root: {
            maxHeight: "89.59px",
            [breakpoints.up("sm")]: {
              maxHeight: "56px",
            },
          },
        },
      },
      MUIDataTableFooter: {
        styleOverrides: {
          root: {
            marginTop: "auto",
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          stackedCommon: {
            "&.datatables-noprint": {
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          },
        },
      },
      MUIDataTablePagination: {
        styleOverrides: {
          navContainer: {
            justifyContent: "center",
            [breakpoints.up("md")]: {
              justifyContent: "flex-end",
            },
          },
          toolbar: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            padding: 0,
            "& > *": {
              margin: "0 auto !important",
              padding: 0,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { fontWeight: 900, borderRadius: "20px", paddingTop: "8px", paddingBottom: "8px", minWidth: "100px" },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: addHexOpacity(colors.palette.primary.main, 35),
              "&:hover": {
                backgroundColor: addHexOpacity(colors.palette.primary.main, 54),
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
              display: "none",
            },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          },
        },
      },
    },
    mixins: {
      transitionAppBarHeight: {
        "@media (min-width:0px)": {
          "@media (orientation: landscape)": {
            transform: "translateY(48px) !important",
          },
        },
        "@media (min-width:600px)": {
          transform: "translateY(64px) !important",
        },
        transform: "translateY(56px) !important",
      },
      removeAppBarHeight: {
        "@media (min-width:0px)": {
          "@media (orientation: landscape)": {
            marginTop: "48px",
          },
        },
        "@media (min-width:600px)": {
          marginTop: "64px",
        },
        marginTop: "56px",
      },
    },
    palette: {
      common: {
        text: "#222",
      },
    },
  };

  return _.merge(globalSetting, themeSettings);
};

export const ThemeModeContext = createContext({
  toggleThemeMode: () => {},
});

export const useThemeMode = () => {
  const [mode, setMode] = useState(getUserModePreference());

  const themeMode = useMemo(
    () => ({
      toggleThemeMode: () =>
        setMode((prev) => {
          const newMode = prev === "light" ? "dark" : "light";
          localStorage.setItem("themeMode", newMode);
          return newMode;
        }),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, themeMode];
};
