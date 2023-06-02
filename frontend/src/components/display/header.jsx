import { Box, Typography } from "@mui/material";

const Header = ({ title, subtitle }) => {
  return (
    <Box >
      <Typography variant="h3" fontWeight="bold" color="primary.main">
        {title.toUpperCase()}
      </Typography>
      <Typography variant="h8">{subtitle}</Typography>
    </Box>
  );
};

export default Header;
