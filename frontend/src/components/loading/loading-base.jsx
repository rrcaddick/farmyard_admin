import Lottie from "lottie-react";
import { Box } from "@mui/material";
import LoadingAnimation from "@animations/loading.json";

// TODO: Add prop for loading animation
const LoadingBase = ({ loading, children }) => {
  return (
    <>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <Box borderRadius="50%" backgroundColor="background.paper">
            <Lottie animationData={LoadingAnimation} loop={true} />
          </Box>
        </Box>
      )}
      {!loading && children}
    </>
  );
};

export default LoadingBase;
