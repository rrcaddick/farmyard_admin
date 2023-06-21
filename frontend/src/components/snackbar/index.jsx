import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
import { forwardRef, useMemo } from "react";
import { useSnackbar, SnackbarContent as NotistackSnackbarContent } from "notistack";
import { Box, Typography, Tooltip, IconButton, useTheme } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RetryIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import SuccessIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

const SnackbarContent = styled(NotistackSnackbarContent, {
  shouldForwardProp: (prop) => isPropValid(prop) && !["backgroundColor", "boxShadow", "color"].includes(prop),
})(({ backgroundColor, color, boxShadow }) => ({
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",
  gap: "1rem",
  padding: "5px",
  borderRadius: "5px",
  width: "90vw",
  maxWidth: "350px",
  fontFamily: "Source Sans Pro",
  backgroundColor,
  boxShadow,
  color,
}));

const Snackbar = forwardRef(({ message, variant, action, id }, ref) => {
  const { closeSnackbar } = useSnackbar();
  const {
    palette,
    shadows,
    palette: { getContrastText },
  } = useTheme();

  const backgroundColor = useMemo(
    () => (variant === "retry" ? palette.error.main : palette.success.main),
    [variant, palette.error.main, palette.success.main]
  );

  const isRetry = useMemo(() => variant === "retry", [variant]);

  const infoIconStyles = useMemo(
    () => ({
      marginLeft: "10px",
      backgroundColor: "white",
      color: isRetry ? "error.main" : "success.main",
      borderRadius: "50%",
      p: "2px",
    }),
    [isRetry]
  );

  return (
    <SnackbarContent
      ref={ref}
      {...{ backgroundColor, color: getContrastText(backgroundColor), boxShadow: shadows[10] }}
    >
      {isRetry ? <ErrorIcon sx={infoIconStyles} /> : <SuccessIcon sx={infoIconStyles} />}

      <Typography
        sx={{
          fontSize: "14px",
          fontFamily: "Source Sans Pro",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </Typography>
      <Box display="flex" marginLeft="auto">
        <Tooltip title={isRetry ? "Retry" : "Undo"}>
          <IconButton
            onClick={() => {
              action();
              closeSnackbar();
            }}
          >
            {isRetry ? <RetryIcon /> : <UndoIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Dismiss">
          <IconButton
            onClick={() => {
              closeSnackbar(id);
            }}
          >
            <CloseIcon
              sx={{ backgroundColor: "white", color: isRetry ? "error.main" : "success.main", borderRadius: "50%" }}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </SnackbarContent>
  );
});

export default Snackbar;
