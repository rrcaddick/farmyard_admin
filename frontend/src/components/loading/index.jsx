import Lottie from "lottie-react";
import LoadingAnimation from "@animations/loading.json";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { LoadingContext } from "@context/loading";
import { Box } from "@mui/system";
import { Paper } from "@mui/material";

const Loading = () => {
  const { isLoading } = useContext(LoadingContext);

  if (!isLoading) return <Outlet />;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
      <Paper sx={{ borderRadius: "50%", m: "5rem" }}>
        <Lottie animationData={LoadingAnimation} loop={true} />
      </Paper>
    </Box>
  );
};

export default Loading;
