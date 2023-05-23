import { useCallback, useEffect, useMemo, useState } from "react";
import { GridRowModes, DataGrid } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { DataGridContext } from "@components/data-grid/crud-data-grid/context/data-grid";
import Box from "@mui/material/Box";
import EditToolbar from "@components/data-grid/crud-data-grid/edit-toolbar";
import CrudActions from "@components/data-grid/crud-data-grid/crud-actions";
import ControlledGridEditInput from "@components/data-grid/crud-data-grid/controlled-grid-edit-input";
import FormRow from "@components/data-grid/crud-data-grid/form-row";

const actionsColumn = {
  field: "actions",
  type: "actions",
  headerAlign: "center",
  align: "center",
  headerName: "Actions",
  cellClassName: "actions",
  getActions: CrudActions,
};

const CrudDataGrid = ({ columns, existingRows = [], schema, addButtonText, onSave, onDelete }) => {
  const [rows, setRows] = useState(existingRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [hasNoContent, setHasNoContent] = useState();

  useEffect(() => {
    setHasNoContent(rows.length === 0);
  }, [rows]);

  const renderEditCell = useCallback((props) => {
    return <ControlledGridEditInput {...props} />;
  }, []);

  const columnsWithActions = useMemo(
    () => [...columns.map((column) => ({ ...column, renderEditCell })), actionsColumn],
    [columns, renderEditCell]
  );

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const addRowHandler = () => {
    //TODO: Replace random id
    const id = randomId();
    setRows((oldRows) => [{ id, name: "", email: "", tel: "", isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  const processRowUpdate = useCallback(
    async (newRow) => {
      const { id, isNew, ...data } = newRow;

      await schema.validate(data);
      onSave(data);
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    [rows, schema, onSave]
  );

  const onProcessRowUpdateError = useCallback(
    (error) => {
      //TODO: Proceses row update error
      return rows;
    },
    [rows]
  );

  const dataGridContextValue = useMemo(
    () => ({
      rows,
      setRows,
      rowModesModel,
      setRowModesModel,
      onDelete,
    }),
    [rows, setRows, rowModesModel, setRowModesModel, onDelete]
  );

  return (
    <Box
      sx={{
        "& .actions": {
          color: "text.secondary",
          justifyContent: "center",
          px: 0,
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGridContext.Provider value={dataGridContextValue}>
        <DataGrid
          autoHeight
          rows={rows}
          density="compact"
          hideFooter
          columns={columnsWithActions}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
          slots={{
            toolbar: EditToolbar,
            noRowsOverlay: () => {
              return <></>;
            },
            row: FormRow,
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel, addRowHandler, buttonText: addButtonText },
            row: { schema },
          }}
          sx={{
            borderColor: "#bbb",
            "& .MuiDataGrid-withBorderColor": {
              borderColor: "#bbb",
            },
            "& .MuiDataGrid-virtualScroller": {
              ...(hasNoContent && { height: "0px" }),
            },
          }}
        />
      </DataGridContext.Provider>
    </Box>
  );
};

export default CrudDataGrid;
