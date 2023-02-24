import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useLinks } from "@navigation/hooks/use-links";
import TabPanel from "@components/tabs/tab-panel";
import { useNavigate } from "react-router-dom";

const MobileNavigation = ({ value, index, toggleSideBar }) => {
  const links = useLinks();
  const navigate = useNavigate();

  const navigateHandler = (url) => {
    navigate(url);
    toggleSideBar(false);
  };

  return (
    <TabPanel value={value} index={index}>
      <List>
        {links.map(({ id, title, icon, url }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton onClick={navigateHandler.bind(this, url)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </TabPanel>
  );
};

export default MobileNavigation;
