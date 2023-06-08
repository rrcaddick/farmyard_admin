import { Box, Typography } from "@mui/material";
import Header from "@components/display/header";

let renderCount = 0;

const Dashboad = () => {
  renderCount++;
  return (
    <Box>
      <Header title="Dashboard" subtitle="An overview of the business" />
      <Typography variant="h2">Render count: {renderCount}</Typography>
    </Box>
  );
};

export default Dashboad;
