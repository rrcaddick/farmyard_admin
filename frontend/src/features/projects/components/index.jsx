import { Box } from "@mui/material";
import Header from "@components/display/header";
import { GET_GROUPS } from "@groups/graphql/queries";
import { useApolloQuery } from "@hooks/use-apollo-query";

const Projects = () => {
  const clickHandler = () => {
    console.log(data);
  };

  const { data, loading, error, serverErrors, refetch } = useApolloQuery(GET_GROUPS);

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      <button onClick={clickHandler}>Parse Form Data</button>
    </Box>
  );
};

export default Projects;
