import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { GridToolbarContainer } from "@mui/x-data-grid";

const EditToolbar = ({ addRowHandler, buttonText, isEditing }) => {
  return (
    <GridToolbarContainer>
      <Button color="primary" disabled={isEditing} startIcon={<AddIcon />} onClick={addRowHandler}>
        {buttonText}
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
