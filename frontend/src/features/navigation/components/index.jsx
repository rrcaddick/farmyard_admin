import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useLinks } from "@navigation/hooks/use-links";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const links = useLinks();
  const navigate = useNavigate();
  return (
    <List>
      {links.map(({ id, title, icon, url }) => (
        <ListItem key={id} disablePadding>
          <ListItemButton onClick={() => navigate(url)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default Navigation;
