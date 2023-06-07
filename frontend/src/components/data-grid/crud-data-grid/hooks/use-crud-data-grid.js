import { useCallback, useEffect, useMemo, useState } from "react";
import { GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid";
import { v4 as uuid } from "uuid";

//TODO: Remove mui data grid package and component if no longer required
const useCrudDataGrid = ({ existingRows, schema, onSave }) => {
  const [rows, setRows] = useState(existingRows);
  const [deletedRow, setDeletedRow] = useState();
  const [rowModesModel, setRowModesModel] = useState({});
  const [hasNoContent, setHasNoContent] = useState();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setHasNoContent(rows.length === 0);
  }, [rows]);

  const toggleEditMode = useCallback((mode = null) => {
    setIsEditing((isEditing) => mode ?? !isEditing);
  }, []);

  const handleRowModesModelChange = useCallback((newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  }, []);

  const onRowEditStop = useCallback((params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }, []);

  const addRowHandler = useCallback(() => {
    toggleEditMode(true);
    const id = uuid();
    setRows((oldRows) => [{ id, name: "", email: "", tel: "", isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  }, [toggleEditMode]);

  const processRowUpdate = useCallback(
    async (newRow) => {
      await schema.validate(newRow);
      onSave(newRow);
      toggleEditMode(false);
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    },
    [rows, schema, onSave, toggleEditMode]
  );

  const onProcessRowUpdateError = useCallback(
    (error) => {
      return rows;
    },
    [rows]
  );

  const undoRowDelete = useCallback(() => {
    const { index, row } = deletedRow;
    setRows((prevRows) => {
      const firstRows = prevRows.slice(0, index);
      const lastRows = prevRows.slice(index);
      return [...firstRows, row, ...lastRows];
    });
    return row;
  }, [deletedRow]);

  const methods = useMemo(
    () => ({
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
    }),
    [
      toggleEditMode,
      handleRowModesModelChange,
      onRowEditStop,
      addRowHandler,
      processRowUpdate,
      onProcessRowUpdateError,
      undoRowDelete,
    ]
  );

  const state = useMemo(
    () => ({
      rows,
      rowModesModel,
      hasNoContent,
      isEditing,
    }),
    [rows, rowModesModel, hasNoContent, isEditing]
  );

  return { methods, state };
};

export { useCrudDataGrid };
