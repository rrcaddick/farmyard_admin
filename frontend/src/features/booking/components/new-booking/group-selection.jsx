import { Button, Divider, TextField } from "@mui/material";
import { Box } from "@mui/system";
import GroupTable from "@components/table/virtualized-table";
import { groupData as data } from "./groupTestData";
import { useState } from "react";

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

const newGroup = (
  <Button variant="outlined" color="secondary" sx={{ boxShadow: (theme) => theme.shadows[15] }}>
    NEW GROUP
  </Button>
);

const GroupSelection = () => {
  const [selectedGroup, setSelectedGroup] = useState({ id: 5 });

  const setSelectedRow = (id) => {
    setSelectedGroup({ id });
  };

  return (
    <Box display="flex" flexGrow={1} padding={2} paddingBottom={0} gap={2}>
      <Box display="flex" flexDirection="column" flex={1} flexGrow={1}>
        <Box py={1} display="flex" justifyContent="space-between" gap="1rem">
          <Box flexGrow={1} sx={{ boxShadow: (theme) => theme.shadows[10] }} borderRadius={1}>
            <TextField
              variant="outlined"
              type="search"
              label="Search Group"
              fullWidth
              placeholder="Eg: New Apostolic"
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" mr="10px">
            {newGroup}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column" }} backgroundColor="background.default" flexGrow={1}>
          <GroupTable {...{ columns, data, selectedRowId: selectedGroup?.id, setSelectedRow, small: true }} />
        </Box>
      </Box>

      <Divider orientation="vertical" />
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" flex={1} gap={2}>
        {newGroup}
      </Box>
    </Box>
  );
};

export default GroupSelection;
