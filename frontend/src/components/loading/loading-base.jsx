import Lottie from "lottie-react";
import LoadingAnimation from "@animations/loading.json";
import LoadError from "@components/loading/error-base";
import { Box } from "@mui/material";
import { cloneElement, useMemo } from "react";

// TODO: Add prop for loading animation
const LoadingBase = ({ loading, error, errorMessage, retry, customError, children, container, animation }) => {
  const defaultAnimation = useMemo(() => <Lottie animationData={LoadingAnimation} loop={true} />, []);

  const _animation = useMemo(() => (animation ? animation : defaultAnimation), [defaultAnimation, animation]);

  const _containedAnimation = useMemo(
    () =>
      container
        ? cloneElement(container, {
            ...container.props,
            children: _animation,
          })
        : null,
    [container, _animation]
  );

  if (error) return <LoadError {...{ errorMessage, retry, customError }} />;

  return (
    <>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} padding="0">
          {container ? _containedAnimation : _animation}
        </Box>
      )}
      {!loading && children}
    </>
  );
};

export default LoadingBase;
