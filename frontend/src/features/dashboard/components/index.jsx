import { useQuery } from "@apollo/client";
import { getMe } from "@auth/graphql/queries";
import { Box, Typography } from "@mui/material";
import Header from "@components/display/header";

const Dashboad = () => {
  return (
    <Box display="flex" flexDirection="column" flexGrow={1} backgroundColor="green" padding={2}>
      <Box display="flex" flexGrow={1} backgroundColor="blue">
        <Box flex={2}></Box>
        <Box flex={3}></Box>
      </Box>
    </Box>
  );
};

export default Dashboad;
