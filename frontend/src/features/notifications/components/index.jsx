import { useColors } from "@hooks/useColors";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import TabPanel from "@components/tabs/tab-panel";

const Notifications = ({ value, index }) => {
  const colors = useColors();

  return (
    <TabPanel value={value} index={index}>
      <List sx={{ display: "flex", flexDirection: "column", gap: "5px", padding: "5px" }}>
        {["Put down rat poison", "Service lawn mover", "Fix chicken coop"].map((text, index) => (
          <ListItem
            key={text}
            sx={{
              backgroundColor: `${index % 2 === 0 ? colors.primary[500] : colors.primary[400]}`,
              borderRadius: "5px",
            }}
          >
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </TabPanel>
  );
};

export default Notifications;
