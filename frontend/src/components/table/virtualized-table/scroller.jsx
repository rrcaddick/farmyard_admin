import { TableContainer, Paper } from "@mui/material";
import { forwardRef } from "react";

const Scroller = forwardRef((props, ref) => {
  return <TableContainer component={Paper} {...props} ref={ref} />;
});

export default Scroller;
