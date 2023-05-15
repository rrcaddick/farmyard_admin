import { Box, Fab } from "@mui/material";
import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import NewBooking from "@booking/components/new-booking/new-booking";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import GroupTable from "@components/table/virtualized-table";

import { groupData as data } from "./new-booking/groupTestData";

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
  {
    label: "Post Code",
    dataKey: "postCode",
  },
];

const Booking = () => {
  const [openNewBooking, setOpenNewBooking] = useState(false);
  const { container } = useOutletContext();

  const closeNewBookingHandler = () => setOpenNewBooking(false);

  const [selectedGroup, setSelectedGroup] = useState({ id: 5 });

  const setSelectedRow = (id) => {
    setSelectedGroup({ id });
  };

  return (
    <Box flexGrow={1} position="relative">
      <Header title="Groups" subtitle="View, Change or Add new groups" />
      <NewBooking open={openNewBooking} container={container} close={closeNewBookingHandler} />
      <Fab
        color="primary"
        onClick={() => setOpenNewBooking(true)}
        sx={(theme) => ({ position: "absolute", top: theme.spacing(2), right: 0 })}
      >
        <AddIcon />
      </Fab>
      <GroupTable {...{ columns, data, selectedRowId: selectedGroup?.id, setSelectedRow }} />
    </Box>
  );
};

export default Booking;