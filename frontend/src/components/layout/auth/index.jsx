import { Outlet } from "react-router-dom";
import { Box, Paper } from "@mui/material";
import { useIsDesktop } from "@hooks/use-is-desktop";

const AuthLayout = () => {
  const isDesktop = useIsDesktop();

  return (
    <Box display="flex" justifyContent="center" padding={isDesktop ? "4rem 2rem" : "2rem 1rem"}>
      <Paper
        sx={{
          padding: isDesktop ? "2rem" : "1rem",
          maxWidth: "550px",
          flexGrow: 1,
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Outlet />
      </Paper>
    </Box>
  );
};

export default AuthLayout;
