import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import { GridRowModes, DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { DataGridContext } from "@components/data-grid/crud-data-grid/context/data-grid";
import Box from "@mui/material/Box";
import EditToolbar from "@components/data-grid/crud-data-grid/edit-toolbar";
import CrudActions from "@components/data-grid/crud-data-grid/crud-actions";
import ControlledGridEditInput from "@components/data-grid/crud-data-grid/controlled-grid-edit-input";
import FormRow from "@components/data-grid/crud-data-grid/form-row";
import { Button, IconButton, Snackbar, Zoom } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCrudDataGrid } from "@components/data-grid/crud-data-grid/hooks/use-crud-data-grid";

const actionsColumn = {
  field: "actions",
  type: "actions",
  headerAlign: "center",
  align: "center",
  headerName: "Actions",
  cellClassName: "actions",
  getActions: CrudActions,
};

const CrudDataGrid = forwardRef(({ columns, existingRows = [], schema, addButtonText, onSave, onDelete }, ref) => {
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);

  const {
    state: { rows, rowModesModel, hasNoContent, isEditing },
    methods: {
      toggleEditMode,
      handleRowModesModelChange,
      onRowEditStop,
      addRowHandler,
      processRowUpdate,
      onProcessRowUpdateError,
      setDeletedRow,
      setRows,
      setRowModesModel,
      undoRowDelete,
    },
  } = useCrudDataGrid({ existingRows, schema, onSave });

  const apiRef = useGridApiRef();

  // Exposes child state to parent
  useImperativeHandle(
    ref,
    () => {
      return {
        isEditing,
        disgardUnsavedChanges: () => {
          const { id, isNew } = rows.find((x) => x.isNew) || { id: Object.keys(rowModesModel)[0] };

          setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
          });

          if (isNew) {
            setRows(rows.filter((row) => row.id !== id));
          }
          toggleEditMode(false);
        },
      };
    },
    [rows, isEditing, rowModesModel, toggleEditMode, setRowModesModel, setRows]
  );

  const renderEditCell = useCallback((props) => {
    return <ControlledGridEditInput {...props} />;
  }, []);

  const columnsWithActions = useMemo(
    () => [...columns.map((column) => ({ ...column, renderEditCell })), actionsColumn],
    [columns, renderEditCell]
  );

  const undoDeleteHandler = () => {
    const row = undoRowDelete();
    onSave(row);
    setDeleteSnackbarOpen(false);
  };

  const toggleDeleteSnackbar = useCallback((mode) => {
    setDeleteSnackbarOpen((prevDeleteSnackbarOpen) => (mode === undefined ? !prevDeleteSnackbarOpen : mode));
  }, []);

  const closeSnackbarHandler = () => {
    setDeleteSnackbarOpen(false);
  };

  const dataGridContextValue = useMemo(
    () => ({
      rows,
      setRows,
      setDeletedRow,
      rowModesModel,
      setRowModesModel,
      onDelete,
      toggleEditMode,
      toggleDeleteSnackbar,
    }),
    [rows, setRows, rowModesModel, setDeletedRow, setRowModesModel, onDelete, toggleEditMode, toggleDeleteSnackbar]
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
          apiRef={apiRef}
          rows={rows}
          density="compact"
          hideFooter
          columns={columnsWithActions}
          editMode="row"
          onRowEditStop={onRowEditStop}
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
            toolbar: { setRows, setRowModesModel, addRowHandler, isEditing, buttonText: addButtonText },
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
        <Snackbar
          open={deleteSnackbarOpen}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={closeSnackbarHandler}
          message="Contact removed"
          TransitionComponent={Zoom}
          action={
            <>
              <Button color="warning" size="small" onClick={undoDeleteHandler}>
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbarHandler}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "secondary.main",
            },
          }}
        />
      </DataGridContext.Provider>
    </Box>
  );
});

export default CrudDataGrid;
