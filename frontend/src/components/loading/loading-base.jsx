import Lottie from "lottie-react";
import { Box } from "@mui/material";
import LoadingAnimation from "@animations/loading.json";
import { cloneElement, useMemo } from "react";

// TODO: Add prop for loading animation
const LoadingBase = ({ loading, children, container, animation }) => {
  const defaultAnimation = useMemo(() => <Lottie animationData={LoadingAnimation} loop={true} />, []);

  const _animation = useMemo(() => (animation ? animation : defaultAnimation), [defaultAnimation, animation]);

  const Container = useMemo(
    () =>
      container
        ? cloneElement(container, {
            ...container.props,
            children: _animation,
          })
        : null,
    [container, _animation]
  );

  return (
    <>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1} padding="0">
          {container ? Container : _animation}
        </Box>
      )}
      {!loading && children}
    </>
  );
};

export default LoadingBase;
