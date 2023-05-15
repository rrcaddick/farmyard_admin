import { TableCell } from "@mui/material";

const RowContent = (_index, row, { columns }) => {
  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey}>{row[column.dataKey]}</TableCell>
      ))}
    </>
  );
};

export default RowContent;
