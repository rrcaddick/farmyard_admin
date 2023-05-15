import { forwardRef } from "react";
import MuiTableHead from "@mui/material/TableHead";

const TableHead = forwardRef((props, ref) => {
  return (
    <MuiTableHead
      {...props}
      ref={ref}
      sx={{
        backgroundColor: "primary.light",
        "& tr > th ": { color: "common.text", fontWeight: 900, fontSize: "16px" },
      }}
    />
  );
});

export default TableHead;
