import MUIDataTable from "mui-datatables";
import { useMemo } from "react";
import LoadingTableBody from "./loading-table-body";

const MuiDataTable = ({ title, data, columns, options, loading }) => {
  const BodyComponent = useMemo(() => (props) => <LoadingTableBody loading={loading} {...props} />, [loading]);

  return <MUIDataTable {...{ title, data, columns, options, loading }} components={{ TableBody: BodyComponent }} />;
};

export default MuiDataTable;
