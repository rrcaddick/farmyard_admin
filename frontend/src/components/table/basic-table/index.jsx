import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const BasicTable = ({ columns, data, small, selectedRowId, setSelectedRow }) => {
  const onClickHandler = (id) => {
    setSelectedRow(id);
  };

  return (
    <Box flexGrow={1} display="flex" overflow="hidden" borderRadius="10px">
      <TableContainer component={Paper}>
        <Table stickyHeader {...(small && { size: "small" })}>
          <TableHead>
            <TableRow>
              {columns.map(({ label, dataKey }) => (
                <TableCell
                  sx={{
                    backgroundColor: "primary.light",
                    color: "common.text",
                    fontWeight: 900,
                  }}
                  key={dataKey}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                selected={selectedRowId === row.id}
                onClick={onClickHandler.bind(this, row.id)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "background.default",
                  },
                }}
              >
                {columns.map(({ dataKey }) => (
                  <TableCell key={dataKey}>{row[dataKey]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BasicTable;
