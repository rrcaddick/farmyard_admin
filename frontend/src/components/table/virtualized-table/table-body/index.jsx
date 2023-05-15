import { forwardRef } from "react";
import MuiTableBody from "@mui/material/TableBody";

const TableBody = forwardRef((props, ref) => {
  return <MuiTableBody {...props} ref={ref} />;
});

export default TableBody;
