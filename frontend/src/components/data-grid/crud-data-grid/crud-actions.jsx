import { useContext } from "react";
import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { DataGridContext } from "@components/data-grid/crud-data-grid/context/data-grid";
import { useFormContext } from "react-hook-form";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const CrudActions = ({ id }) => {
  const { setRowModesModel, rows, setRows, rowModesModel } = useContext(DataGridContext);
  const {
    formState: { isValid },
  } = useFormContext();

  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
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
