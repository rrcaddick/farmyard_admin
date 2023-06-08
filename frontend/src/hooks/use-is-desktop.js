import { useMediaQuery, useTheme } from "@mui/material";

// TODO: Memoized hook to only cause re-render on window size change
const useIsDesktop = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up("md"));
};

export { useIsDesktop };
