import DashboardIcon from "@mui/icons-material/Dashboard";
import BookingIcon from "@mui/icons-material/CalendarMonth";
import FinanceIcon from "@mui/icons-material/Money";
import ProjectIcon from "@mui/icons-material/Group";
import ContactsIcon from "@mui/icons-material/Contacts";
import { useMemo } from "react";

const navLinks = [
  {
    id: 1,
    title: "Dashboard",
    icon: <DashboardIcon />,
    url: "/",
  },
  {
    id: 2,
    title: "Bookings",
    icon: <BookingIcon />,
    url: "/bookings",
  },
  {
    id: 3,
    title: "Finance",
    icon: <FinanceIcon />,
    url: "/finance",
  },
  {
    id: 4,
    title: "Projects",
    icon: <ProjectIcon />,
    url: "/projects",
  },
  {
    id: 5,
    title: "Contacts",
    icon: <ContactsIcon />,
    url: "/contacts",
  },
];

const useLinks = () => {
  return useMemo(() => navLinks, []);
};

export { useLinks };
