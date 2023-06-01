import { useContext } from "react";
import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { DataGridContext } from "@components/data-grid/crud-data-grid/context/data-grid";
import { useFormContext } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const CrudActions = ({ id }) => {
  const {
    setRowModesModel,
    rows,
    setRows,
    setDeletedRow,
    rowModesModel,
    onDelete,
    toggleEditMode,
    toggleDeleteSnackbar,
  } = useContext(DataGridContext);

  const {
    formState: { isValid },
  } = useFormContext();

  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    toggleEditMode(true);
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    const index = rows.findIndex((row) => row.id === id);
    setDeletedRow({ index, row: rows.at(index) });
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    toggleDeleteSnackbar(true);
    onDelete(id);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
    toggleEditMode(false);
  };

  if (isInEditMode) {
    return [
      <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} disabled={!isValid} />,
      <GridActionsCellItem
        icon={<CancelIcon />}
        label="Cancel"
        className="textPrimary"
        onClick={handleCancelClick(id)}
        color="inherit"
      />,
    ];
  }

  return [
    <GridActionsCellItem
      icon={<EditIcon />}
      label="Edit"
      className="textPrimary"
      onClick={handleEditClick(id)}
      color="inherit"
    />,
    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} color="inherit" />,
  ];
};

export default CrudActions;
