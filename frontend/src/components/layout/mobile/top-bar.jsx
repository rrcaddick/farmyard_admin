import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

const TopBar = ({ sidebarOpen, toggleSideBar }) => {
  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <IconButton
          color="inherit"
          onClick={() => toggleSideBar(true)}
          edge="start"
          sx={{
            ...(sidebarOpen && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
