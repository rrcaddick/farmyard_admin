import { Box, Typography } from "@mui/material";

const Header = ({ title, subtitle }) => {
  return (
    <Box mb="15px">
      <Typography variant="h3" fontWeight="bold">
        {title.toUpperCase()}
      </Typography>
      <Typography variant="h8">{subtitle}</Typography>
    </Box>
  );
};

export default Header;
