import Lottie from "lottie-react";
import loadError from "@animations/load-error.json";
import ErrorAnimation from "@animations/triangle-error.json";
import { Box, Typography, Button } from "@mui/material";
import { useMemo } from "react";
import { useIsDesktop } from "@hooks/use-is-desktop";

const LoadError = ({ error, retry, customError }) => {
  const isDesktop = useIsDesktop();

  const defaultError = useMemo(
    () => (
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        gap={isDesktop ? "2rem" : "1rem"}
        alignItems="center"
        justifyContent="center"
      >
        {/* TODO: Choose better error animation or else just img */}
        <Lottie animationData={ErrorAnimation} loop={true} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography textAlign="center" variant="h4" color="error.main">
            {error.header ?? "Oops!"}
          </Typography>
          <Typography textAlign="center" variant="h6" color="error.main">
            {error.message ??
              "Something went wrong. You can retry or contact your system administrator if the issue persists"}
          </Typography>
        </Box>
        {/* Retry mutation */}
        <Button variant="contained" onClick={() => retry()}>
          Try Again
        </Button>
      </Box>
    ),
    [isDesktop, retry, error.header, error.message]
  );

  return customError ?? defaultError;
};

export default LoadError;
