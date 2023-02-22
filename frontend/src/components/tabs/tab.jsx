import MuiTab from "@mui/material/Tab";
import Portal from "@mui/material/Portal";
import { forwardRef, Children, cloneElement } from "react";

const Tab = forwardRef(({ children, index, ...props }, ref) => {
  return (
    <>
      <MuiTab {...props} />
      <Portal container={ref.current}>
        {Children.map(children, (child) => cloneElement(child, { ...child.props, index }))}
      </Portal>
    </>
  );
});

export default Tab;
