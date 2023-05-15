import DashboardIcon from "@mui/icons-material/Dashboard";
import BookingIcon from "@mui/icons-material/CalendarMonth";
import FinanceIcon from "@mui/icons-material/Money";
import GroupsIcon from "@mui/icons-material/Groups";
import ContactsIcon from "@mui/icons-material/Contacts";
import ProjectIcon from "@mui/icons-material/Agriculture";
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
    title: "Groups",
    icon: <GroupsIcon />,
    url: "/groups",
  },
  {
    id: 5,
    title: "Contacts",
    icon: <ContactsIcon />,
    url: "/contacts",
  },
  {
    id: 6,
    title: "Projects",
    icon: <ProjectIcon />,
    url: "/projects",
  },
];

const useLinks = () => {
  return useMemo(() => navLinks, []);
};

export { useLinks };
