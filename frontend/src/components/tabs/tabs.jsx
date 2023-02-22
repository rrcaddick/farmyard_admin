import { useRef, Children, cloneElement } from "react";
import MuiTabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";

const Tabs = ({ children, ...props }) => {
  const container = useRef();

  return (
    <>
      <MuiTabs
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "5px",
          "& .MuiButtonBase-root": {
            minWidth: "0px",
            flex: 1,
          },
        }}
        {...props}
      >
        {Children.map(children, (child, index) => cloneElement(child, { ...child.props, index, ref: container }))}
      </MuiTabs>
      <Box ref={container} />
    </>
  );
};

export default Tabs;
