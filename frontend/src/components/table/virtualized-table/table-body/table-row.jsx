import MuiTableRow from "@mui/material/TableRow";

const TableRow = ({ context: { selectedRowId, setSelectedRow }, item: { id }, ...props }) => {
  const onClickHandler = () => {
    setSelectedRow(id);
  };

  return (
    <MuiTableRow
      selected={selectedRowId === id}
      onClick={onClickHandler}
      {...props}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "background.default",
        },
        "& > td": {
          fontSize: "16px",
        },
      }}
    />
  );
};

export default TableRow;
