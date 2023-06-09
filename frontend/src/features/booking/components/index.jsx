import { Box, Fab } from "@mui/material";
import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import AddUpdateBooking from "@booking/components/new-booking/new-booking";
import { useOutletContext } from "react-router-dom";
import GroupTable from "@components/table/virtualized-table";

import { groupData as data } from "./new-booking/groupTestData";
import useModal from "@components/modal/use-modal";

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

const Booking = () => {
  const { container } = useOutletContext();
  const { open, Modal: AddUpdateBookingModal } = useModal();

  return (
    <Box flexGrow={1} position="relative" display="flex" flexDirection="column" overflow="hidden">
      <Header title="Bookings" subtitle="Manage your bookings" />
      <Fab color="secondary" onClick={open} sx={(theme) => ({ position: "absolute", top: theme.spacing(2), right: 0 })}>
        <AddIcon />
      </Fab>
      <GroupTable {...{ columns, data }} />
      <AddUpdateBookingModal modalProps={{ container: container.current }}>
        <AddUpdateBooking />
      </AddUpdateBookingModal>
    </Box>
  );
};

export default Booking;
