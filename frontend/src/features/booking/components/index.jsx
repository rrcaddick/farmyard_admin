import { Fab } from "@mui/material";
import Header from "@components/display/header";
import AddIcon from "@mui/icons-material/Add";
import NewBooking from "./new-booking";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";

const Booking = () => {
  const [openNewBooking, setOpenNewBooking] = useState(false);
  const { container } = useOutletContext();

  const closeNewBookingHandler = () => setOpenNewBooking(false);

  return (
    <>
      <Header title="Bookings" subtitle="Manage your bookings" />
      <NewBooking open={openNewBooking} container={container} close={closeNewBookingHandler} />
      <Fab
        color="primary"
        onClick={() => setOpenNewBooking(true)}
        sx={(theme) => ({ position: "absolute", bottom: theme.spacing(3), right: theme.spacing(3) })}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default Booking;
