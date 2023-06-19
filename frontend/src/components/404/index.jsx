import Lottie from "lottie-react";
import _404Animation from "@animations/404.json";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "@hooks/use-is-desktop";

const _404 = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      flexGrow={1}
      padding="3rem"
    >
      <Typography variant="h4" textAlign="center">
        Looks like the page you're looking for doesn't exist
      </Typography>
      <Lottie animationData={_404Animation} loop={true} />
      <Button variant="contained" sx={{ fontWeight: "bold" }} fullWidth={!isDesktop} onClick={() => navigate("/")}>
        Back Home?
      </Button>
    </Box>
  );
};

export default _404;
