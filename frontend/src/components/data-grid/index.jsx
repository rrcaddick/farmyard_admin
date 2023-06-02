import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";

const DataGrid = ({ columns, rows }) => {
  return <MuiDataGrid {...{ columns, rows }} getRowId={({ id }) => id} />;
};

export default DataGrid;
