import { Box } from "@mui/material";
import Header from "@components/display/header";

const Projects = () => {
  return (
    <Box display="flex" flexDirection="column" overflow="hidden" gap={5}>
      <Header title="Projects" subtitle="Never let a project fail again" />
    </Box>
  );
};

export default Projects;
