import { Box, Paper } from "@mui/material";
import Header from "@components/display/header";
import Compnonent from "./component";

const Projects = () => {
  return (
    <Box display="flex" flexDirection="column" overflow="hidden" gap={5}>
      <Header title="Projects" subtitle="Never let a project fail again" />
      <Compnonent container={<Paper sx={{ backgroundColor: "red", height: "100px", width: "100px" }} />} />
    </Box>
  );
};

export default Projects;
