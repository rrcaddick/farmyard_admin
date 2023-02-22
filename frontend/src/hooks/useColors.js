import { useTheme } from "@mui/material";
import { getColors } from "@theme";

const useColors = () => {
  const theme = useTheme();
  return getColors(theme.palette.mode);
};

export { useColors };
