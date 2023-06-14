import { Box } from "@mui/material";
import Header from "@components/display/header";

const Projects = () => {
  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
    </Box>
  );
};

export default Projects;
