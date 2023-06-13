import { TableBody, TableBodyCell, TableBodyRow } from "mui-datatables";
import { TableBody as MuiTableBody } from "@mui/material";
import { useMemo } from "react";
import useLoading from "@components/loading/use-loading";

const LoadingTableBody = ({ loading, options, columns, ...others }) => {
  const visibleColCnt = useMemo(() => columns.filter((c) => c.display === "true").length, [columns]);
  const { Loading } = useLoading(loading);

  return loading ? (
    <MuiTableBody>
      <TableBodyRow options={options}>
        <TableBodyCell
          colSpan={options.selectableRows !== "none" || options.expandableRows ? visibleColCnt + 1 : visibleColCnt}
          options={{}}
          colIndex={0}
          rowIndex={0}
        >
          <Loading />
        </TableBodyCell>
      </TableBodyRow>
    </MuiTableBody>
  ) : (
    <TableBody options={options} columns={columns} {...others} />
  );
};

export default LoadingTableBody;
