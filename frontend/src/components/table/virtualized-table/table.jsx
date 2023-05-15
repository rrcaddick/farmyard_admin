import MuiTable from "@mui/material/Table";

const Table = ({ context: { small }, ...props }) => {
  return <MuiTable {...props} sx={{ borderCollapse: "separate" }} {...(small && { size: "small" })} />;
};

export default Table;
