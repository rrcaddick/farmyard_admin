import { useQuery } from "@apollo/client";
import { getMe } from "@auth/graphql/queries";
import { Box } from "@mui/material";
import Header from "@components/display/header";

const Dashboad = () => {
  const { loading, error, data } = useQuery(getMe);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Box>
      <Header title="Dashboard" subtitle="Information about your business" />
    </Box>
  );
};

export default Dashboad;
