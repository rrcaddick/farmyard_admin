import { Box, Button } from "@mui/material";
import Header from "@components/display/header";

const Projects = () => {
  const testHandler = () => {
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      <input type="text" />
      <Button onClick={testHandler}>Test</Button>
    </Box>
  );
};

export default Projects;
