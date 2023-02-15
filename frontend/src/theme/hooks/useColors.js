import { useTheme } from "@mui/material";
import { getColors } from "../";

const useColors = () => {
  const theme = useTheme();
  return getColors(theme.palette.mode);
};

export { useColors };
