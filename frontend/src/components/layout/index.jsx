import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useColors } from "../../theme/hooks/useColors";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TopBar from "./top-bar";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  const colors = useColors();

  const [sidebarOpen, setSideBarOpen] = useState(true);
  const drawerWidth = 260;

  return (
    <>
      <Box component="header">
        <TopBar sidebarOpen={sidebarOpen} drawerWidth={drawerWidth} openSideBar={setSideBarOpen} />
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: colors.primary[400],
          },
        }}
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", backgroundColor: colors.primary[800] }}>
          <Typography variant="h6" noWrap component="div">
            Admin Yard
          </Typography>
          <IconButton onClick={() => setSideBarOpen(false)}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {["Bookings", "Capacity", "Payroll", "Invoices"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText>
                  <Link to={index % 2 === 0 ? "/" : "/booking"}>{text}</Link>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Absence Management", "To Do List", "Calendar"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text}></ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          ...(sidebarOpen && { width: `calc(100% - ${drawerWidth}px)`, marginLeft: `${drawerWidth}px` }),
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
