import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import NewGroup from "@groups/components/new-group";
import GroupTable from "@components/table/virtualized-table";
import GroupActions from "@groups/components/group-actions";
import { useMemo, useState } from "react";
import { Box, Fab, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGetAllGroups } from "@groups/graphql/hooks";

const columns = [
  {
    label: "Name",
    dataKey: "name",
  },
  {
    label: "Type",
    dataKey: "type",
  },
  {
    label: "Address",
    dataKey: "street",
  },
  {
    label: "Suburb",
    dataKey: "suburb",
  },
  {
    label: "Post Code",
    dataKey: "postCode",
  },
  {
    label: "Actions",
    dataKey: "render",
    align: "center",
    width: "100px",
  },
];

const createTableData = (groups) => {
  return groups.map((group) => {
    const {
      id,
      name,
      groupType: { type },
      address: { street, suburb, postCode },
    } = group;

    return { id, name, type, street, suburb, postCode, render: GroupActions };
  });
};

const Groups = () => {
  const { groups, loading } = useGetAllGroups();
  const { container } = useOutletContext();

  const [openNewGroup, setOpenNewGroup] = useState(false);
  const closeNewGroupHandler = () => setOpenNewGroup(false);

  const [selectedGroup, setSelectedGroup] = useState({ id: 5 });

  const setSelectedRow = (id) => {
    setSelectedGroup({ id });
  };

  const data = useMemo(() => createTableData(groups), [groups]);

  return (
    <Box flexGrow={1} display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" alignItems="center" px="10px">
        <Header title="Groups" subtitle="View, Update or Add new groups" />
        <Fab color="secondary" onClick={() => setOpenNewGroup(true)}>
          <AddIcon />
        </Fab>
      </Box>
      <NewGroup open={openNewGroup} container={container} onClose={closeNewGroupHandler} />
      {/* {loading && <Typography>Loading...</Typography>}
      {!loading && <GroupTable {...{ columns, data, selectedRowId: selectedGroup?.id, setSelectedRow }} />} */}
    </Box>
  );
};

export default Groups;
