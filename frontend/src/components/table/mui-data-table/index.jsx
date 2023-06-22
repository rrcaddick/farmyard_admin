import MUIDataTable from "mui-datatables";
import { useMemo } from "react";
import LoadingTableBody from "./loading-table-body";

const MuiDataTable = ({ title, data, columns, options, loading, error, retry }) => {
  const BodyComponent = useMemo(
    () => (props) => <LoadingTableBody {...{ loading, error, retry, ...props }} />,
    [loading, error, retry]
  );

  return (
    <MUIDataTable {...{ title, data, columns, options, loading, error }} components={{ TableBody: BodyComponent }} />
  );
};

export default MuiDataTable;
