import Lottie from "lottie-react";
import loadError from "@animations/load-error.json";
import { Box, Typography, Button } from "@mui/material";
import { useMemo } from "react";
import { useIsDesktop } from "@hooks/use-is-desktop";

const LoadError = ({ errorMessage, retry, customError }) => {
  const isDesktop = useIsDesktop();

  const defaultErrorMessage = useMemo(
    () => `Oops! Something went wrong. You can either retry this
  action, or contact your system administrator if the issue persists`,
    []
  );
  const _errorMessage = useMemo(() => errorMessage ?? defaultErrorMessage, [errorMessage, defaultErrorMessage]);

  const defaultError = useMemo(
    () => (
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        alignItems="center"
        justifyContent="space-between"
        p={isDesktop ? "2rem" : "1rem"}
        paddingTop="2rem"
      >
        <Typography
          textAlign="center"
          fontSize={isDesktop ? "1.2rem" : "0.9rem"}
          color="error.main"
          fontWeight="800"
          letterSpacing="0.15rem"
          maxWidth="800px"
        >
          {_errorMessage.toUpperCase()}
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => retry()}>
          Retry
        </Button>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Lottie animationData={loadError} loop={true} />
        </Box>
      </Box>
    ),
    [_errorMessage, isDesktop, retry]
  );

  return customError ?? defaultError;
};

export default LoadError;
