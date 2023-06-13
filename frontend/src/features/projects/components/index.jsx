import { Box } from "@mui/material";
import Header from "@components/display/header";
import MuiDataTable from "@components/table/mui-data-table";
import { useGetAllGroups } from "@groups/hooks";

const columns = [
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

const Projects = () => {
  const { groups, loading } = useGetAllGroups();

  const options = {
    filterType: "dropdown",
    enableNestedDataAccess: ".",
    responsive: "vertical",
    onRowsDelete: async (deletedRows, data) => {},
  };

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      <Box display="flex" flexGrow={1} overflow="hidden">
        <MuiDataTable
          title="View, Update or Add new groups"
          data={groups}
          columns={columns}
          options={options}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default Projects;
