import { TableBody, TableBodyCell, TableBodyRow } from "mui-datatables";
import { Box, Button, TableBody as MuiTableBody, Typography } from "@mui/material";
import { useMemo } from "react";
import useLoading from "@components/loading/use-loading";
import { useIsDesktop } from "@hooks/use-is-desktop";

const createTableError = (isDesktop, error, retry) => (
  <Box
    display="flex"
    flexDirection="column"
    flexGrow={1}
    gap={isDesktop ? "2rem" : "1rem"}
    alignItems="center"
    justifyContent="center"
    height="100%"
  >
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography textAlign="center" variant="h4" color="error.main">
        {error?.header ?? "Oops!"}
      </Typography>
      <Typography textAlign="center" variant="h6" color="error.main">
        {error?.message ??
          "Something went wrong. You can retry or contact your system administrator if the issue persists"}
      </Typography>
    </Box>
    {/* Retry mutation */}
    <Button variant="contained" onClick={() => retry && retry()}>
      Try Again
    </Button>
  </Box>
);

const LoadingTableBody = ({ loading, error, retry, options, columns, ...others }) => {
  const visibleColCnt = useMemo(() => columns.filter((c) => c.display === "true").length, [columns]);
  const { Loading } = useLoading(loading);
  const isDesktop = useIsDesktop();

  if (!loading && !error) return <TableBody options={options} columns={columns} {...others} />;

  return (
    <MuiTableBody>
      <TableBodyRow options={options}>
        <TableBodyCell
          colSpan={options.selectableRows !== "none" || options.expandableRows ? visibleColCnt + 1 : visibleColCnt}
          options={{}}
          colIndex={0}
          rowIndex={0}
        >
          <Loading error={error} customError={createTableError(isDesktop, error, retry)} />
        </TableBodyCell>
      </TableBodyRow>
    </MuiTableBody>
  );
};

export default LoadingTableBody;
