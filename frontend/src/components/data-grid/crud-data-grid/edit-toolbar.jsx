import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { GridToolbarContainer } from "@mui/x-data-grid";

const EditToolbar = ({ addRowHandler, buttonText }) => {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={addRowHandler}>
        {buttonText}
      </Button>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
