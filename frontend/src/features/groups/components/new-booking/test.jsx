import { forwardRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";

const sample = [
  ["Church on the Rock", "34 Main Road", "Paarl"],
  ["New Apostolic", "162 Greens Ave", "Bluedowns"],
  ["Groen Dakkies Skill School", "Groenfontein Road", "Franshoek"],
];

function createData(id, groupName, street, suburb) {
  return { id, groupName, street, suburb };
}

const columns = [
  {
    label: "Group Name",
    dataKey: "groupName",
  },
  {
    label: "Address",
    dataKey: "street",
  },
  {
    label: "Suburb",
    dataKey: "suburb",
  },
];

const rows = Array.from({ length: 200 }, (_, index) => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createData(index, ...randomSelection);
});

const VirtuosoTableComponents = {
  Scroller: forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => <Table {...props} sx={{ borderCollapse: "separate" }} />,
  TableHead: forwardRef((props, ref) => (
    <TableHead
      {...props}
      ref={ref}
      sx={{
        backgroundColor: "primary.light",
        "& tr > th ": { color: "common.text", fontWeight: 900, fontSize: "16px" },
      }}
    />
  )),
  TableRow: (props) => (
    <TableRow
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
  ),
  TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell key={column.dataKey} variant="head">
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <>
      {columns.map((column) => (
        <TableCell key={column.dataKey}>{row[column.dataKey]}</TableCell>
      ))}
    </>
  );
}

export default function ReactVirtualizedTable() {
  return (
    <TableVirtuoso
      data={rows}
      components={VirtuosoTableComponents}
      fixedHeaderContent={fixedHeaderContent}
      itemContent={rowContent}
    />
  );
}
