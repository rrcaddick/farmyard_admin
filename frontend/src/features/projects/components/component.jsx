import { Typography } from "@mui/material";
import { cloneElement } from "react";

const Compnonent = ({ container }) => {
  const Container = cloneElement(container, { ...container.props, children: <Typography>Loading</Typography> });
  if (container) return Container;
  return <Typography>Loading</Typography>;
};

export default Compnonent;
