import styled from "@mui/material/styles/styled";
import { Divider, Drawer as MuiDrawer, IconButton, useTheme } from "@mui/material";
import DrawerHeader from "@components/layout/drawer-header";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Navigation from "@navigation/components";

const openedMixin = (theme, drawerWidth) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => !["sidebarOpen", "drawerWidth"].includes(prop) })(
  ({ theme, sidebarOpen, drawerWidth }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(sidebarOpen && {
      ...openedMixin(theme, drawerWidth),
      "& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
    }),
    ...(!sidebarOpen && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

const SideBar = ({ sidebarOpen, drawerWidth, toggleSideBar }) => {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" sidebarOpen={sidebarOpen} drawerWidth={drawerWidth}>
      <DrawerHeader>
        <IconButton onClick={toggleSideBar}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Navigation />
    </Drawer>
  );
};

export default SideBar;
