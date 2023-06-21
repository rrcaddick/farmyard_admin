import { Box } from "@mui/material";
import Header from "@components/display/header";
import { GET_GROUPS } from "@groups/graphql/queries";
import { useQuery } from "@apollo/client";

const Projects = () => {
  const {
    data: { getGroups } = {},
    loading,
    error,
  } = useQuery(GET_GROUPS, { variables: { groupIds: ["6480950f49f117e9390c59ac", "6480adb23bf993be719a67c8"] } });

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      {JSON.stringify(getGroups)}
    </Box>
  );
};

export default Projects;
