import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ViewIcon from "@mui/icons-material/FileOpen";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const GroupActions = ({ row }) => {
  const editGroupHandler = () => {
    // Open new/edit group modal
  };

  const deleteGroupHandler = () => {
    //TODO: Add delete group mutation
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <IconButton onClick={editGroupHandler}>
        <ViewIcon />
      </IconButton>
      <Divider orientation="vertical" sx={{ height: "20px", borderWidth: "1.5px", borderColor: "primary.light" }} />
      <IconButton onClick={editGroupHandler}>
        <EditIcon />
      </IconButton>
      <Divider orientation="vertical" sx={{ height: "20px", borderWidth: "1.5px", borderColor: "primary.light" }} />
      <IconButton onClick={deleteGroupHandler}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default GroupActions;
