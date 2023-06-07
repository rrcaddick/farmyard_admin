import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateGroup from "@groups/components/add-update-group";
import { useMemo, useState } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useDeleteGroups, useGetAllGroups } from "@groups/graphql/hooks";
import ViewIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Update";
import MUIDataTable from "mui-datatables";
import { useIsDesktop } from "@hooks/use-is-desktop";

const columnDefs = [
  {
    name: "id",
    label: "Id",
    options: {
      display: false,
      filter: false,
      sort: false,
      viewColumns: false,
    },
  },
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
  const [openNewGroup, setOpenNewGroup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState();

  const { container } = useOutletContext();
  const isDesktop = useIsDesktop();

  const { groups, loading } = useGetAllGroups();
  //TODO: Show feedback for delete errors
  const { mutate: deleteGroups, loading: deleteGroupsLoading, errors } = useDeleteGroups();

  const actions = useMemo(
    () => ({
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <IconButton
              onClick={() => {
                return toggleAddUpdateGroup(true, tableMeta.rowData[0]);
              }}
            >
              <ViewIcon />
            </IconButton>
          );
        },
      },
    }),
    []
  );

  const columns = useMemo(() => [...columnDefs, actions], [actions]);

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

  const toggleAddUpdateGroup = (action, selectedGroupId) => {
    setSelectedGroupId(selectedGroupId ? selectedGroupId : null);
    setOpenNewGroup(action);
  };

  return (
    <>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        gap="1rem"
        overflow="hidden"
        {...(!isDesktop && { paddingTop: "0.5rem" })}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" px="10px">
          <Header title="Groups" />
          <Fab color="secondary" onClick={() => toggleAddUpdateGroup(true)}>
            <AddIcon />
          </Fab>
        </Box>
        <Box display="flex" flexGrow={1} overflow="hidden">
          <MUIDataTable title="View, Update or Add new groups" data={groups} columns={columns} options={options} />
        </Box>
      </Box>
      <AddUpdateGroup
        {...{ container, open: openNewGroup, groupId: selectedGroupId }}
        onClose={() => toggleAddUpdateGroup(false)}
      />
    </>
  );
};

export default Groups;
