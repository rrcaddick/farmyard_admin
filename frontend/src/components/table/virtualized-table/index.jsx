import { TableVirtuoso } from "react-virtuoso";
import Table from "./table";
import Scroller from "./scroller";
import TableHead from "./table-head";
import FixedHeaderContent from "./table-head/fixed-header-content";
import TableBody from "./table-body";
import TableRow from "./table-body/table-row";
import RowContent from "./table-body/row-content";
import Box from "@mui/material/Box";

const MuiVirtualizedTable = ({ columns, data, selectedRowId, setSelectedRow, small }) => {
  return (
    <Box flexGrow={1} display="flex" overflow="hidden" borderRadius="10px">
      <TableVirtuoso
        context={{ columns, selectedRowId, setSelectedRow, small }}
        data={data}
        components={{ Table, Scroller, TableHead, TableBody, TableRow }}
        fixedHeaderContent={FixedHeaderContent.bind(this, { columns })}
        itemContent={RowContent}
      />
    </Box>
  );
};

export default MuiVirtualizedTable;
