import { TableCell } from "@mui/material";

const RowContent = (_index, row, { columns }) => {
  return (
    <>
      {columns.map(({ dataKey }) => {
        const cell = row[dataKey];

        if (dataKey === "render") {
          return <TableCell key={dataKey}>{cell({ row })}</TableCell>;
        }

        return <TableCell key={dataKey}>{cell}</TableCell>;
      })}
    </>
  );
};

export default RowContent;
