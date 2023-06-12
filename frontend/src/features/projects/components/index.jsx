import { Box, Button } from "@mui/material";
import Header from "@components/display/header";
import useGroup from "@groups/hooks/use-group";

const Projects = () => {
  const { getGroups } = useGroup();

  const getGroupsHandler = async () => {
    const data = await getGroups();
    console.log(data);
  };

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" gap={5}>
      <Header title="Projects" subtitle="Never let a project fail again" />
      <Button onClick={getGroupsHandler}>Load Groups</Button>
    </Box>
  );
};

export default Projects;
