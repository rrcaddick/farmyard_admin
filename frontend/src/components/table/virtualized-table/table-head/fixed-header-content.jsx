import { TableCell, TableRow } from "@mui/material";

const FixedHeaderContent = ({ columns }) => {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.dataKey} variant="head">
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default FixedHeaderContent;
