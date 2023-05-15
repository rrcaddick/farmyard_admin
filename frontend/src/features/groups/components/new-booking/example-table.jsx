import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(id, name, street, suburb, postcode) {
  return { id, name, street, suburb, postcode };
}

const rows = [
  createData(1, "Church on the Rock", "34 Main Road", "Paarl", 7263),
  createData(2, "New Apostolic", "162 Greens Ave", "Bluedowns", 3474),
  createData(3, "Groen Dakkies Skill School", "Groenfontein Road", "Franshoek", 5278),
  createData(4, "Church on the Rock", "34 Main Road", "Paarl", 7263),
  createData(5, "New Apostolic", "162 Greens Ave", "Bluedowns", 3474),
  createData(6, "Groen Dakkies Skill School", "Groenfontein Road", "Franshoek", 5278),
  createData(7, "Church on the Rock", "34 Main Road", "Paarl", 7263),
  createData(8, "New Apostolic", "162 Greens Ave", "Bluedowns", 3474),
  createData(9, "Groen Dakkies Skill School", "Groenfontein Road", "Franshoek", 5278),
  createData(10, "Church on the Rock", "34 Main Road", "Paarl", 7263),
  createData(11, "New Apostolic", "162 Greens Ave", "Bluedowns", 3474),
  createData(12, "Groen Dakkies Skill School", "Groenfontein Road", "Franshoek", 5278),
  createData(13, "Church on the Rock", "34 Main Road", "Paarl", 7263),
  createData(14, "New Apostolic", "162 Greens Ave", "Bluedowns", 3474),
  createData(15, "Groen Dakkies Skill School", "Groenfontein Road", "Franshoek", 5278),
  createData(16, "Church on the Rock", "34 Main Road", "Paarl", 7263),
  createData(17, "New Apostolic", "162 Greens Ave", "Bluedowns", 3474),
  createData(18, "Groen Dakkies Skill School", "Groenfontein Road", "Franshoek", 5278),
  createData(19, "Church on the Rock", "34 Main Road", "Paarl", 7263),
  createData(20, "New Apostolic", "162 Greens Ave", "Bluedowns", 3474),
  createData(21, "Groen Dakkies Skill School", "Groenfontein Road", "Franshoek", 5278),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper} sx={{ flexGrow: 1, backgroundColor: "background.main" }}>
      <Table aria-label="simple table" size="small">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "primary.light",
              "& > th ": { color: "common.text", fontWeight: 900 },
            }}
          >
            <TableCell>Group Name</TableCell>
            <TableCell>Street</TableCell>
            <TableCell>Suburb</TableCell>
            <TableCell>Post Code</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "background.default",
                },
              }}
            >
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.street}</TableCell>
              <TableCell>{row.suburb}</TableCell>
              <TableCell>{row.postcode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
