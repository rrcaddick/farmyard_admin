import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import NewGroup from "@groups/components/new-group";
import DataGrid from "@components/data-grid";
import GroupActions from "@groups/components/group-actions";
import { useMemo, useRef, useState } from "react";
import { Box, Fab, Typography } from "@mui/material";
import {} from "@mui/styled-engine/legacy/";
import { useOutletContext } from "react-router-dom";
import { useDeleteGroups, useGetAllGroups } from "@groups/graphql/hooks";
import ViewIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MUIDataTable from "mui-datatables";

const columns = [
  {
    name: "name",
    label: "Group Name",
  },
  {
    name: "groupType.type",
    label: "Group Type",
  },
  {
    name: "address.street",
    label: "Street",
  },
  {
    name: "address.suburb",
    label: "Suburb",
  },
  {
    name: "address.postCode",
    label: "Post Code",
  },
];

const Groups = () => {
  const { groups, loading } = useGetAllGroups();
  const { mutate: deleteGroups, loading: deleteGroupsLoading, errors } = useDeleteGroups();
  const { container } = useOutletContext();

  const tableContainerRef = useRef();

  const options = {
    filterType: "dropdown",
    enableNestedDataAccess: ".",
    responsive: "vertical",
    onRowsDelete: async (deletedRows, data) => {
      const deletedIds = deletedRows?.data.map(({ index }) => groups[index].id);
      try {
        await deleteGroups({
          variables: { groupIds: deletedIds },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
  };

  const [openNewGroup, setOpenNewGroup] = useState(false);
  const closeNewGroupHandler = () => setOpenNewGroup(false);

  return (
    <>
      <Box flexGrow={1} display="flex" flexDirection="column" gap="2rem" overflow="hidden">
        <Box display="flex" justifyContent="space-between" alignItems="center" px="10px">
          <Header title="Groups" />
          <Fab color="secondary" onClick={() => setOpenNewGroup(true)}>
            <AddIcon />
          </Fab>
        </Box>
        <Box display="flex" flexGrow={1} ref={tableContainerRef} overflow="hidden">
          <MUIDataTable title="View, Update or Add new groups" data={groups} columns={columns} options={options} />
        </Box>
      </Box>
      <NewGroup open={openNewGroup} container={container} onClose={closeNewGroupHandler} />
    </>
  );
};

export default Groups;
