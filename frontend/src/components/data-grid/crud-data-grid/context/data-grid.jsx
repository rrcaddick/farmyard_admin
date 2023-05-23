import { createContext } from "react";

const DataGridContext = createContext({
  rows: [],
  setRows: () => {},
  rowModesModel: {},
  setRowModesModel: () => {},
});

export { DataGridContext };
