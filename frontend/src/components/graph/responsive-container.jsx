import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const ResponsiveContainer = ({ children }) => {
  const container = useRef();
  const [{ paddingX, paddingY }, setParentPadding] = useState({
    paddingX: "0px",
    paddingY: "0px",
  });

  // Fixes infinite scaling bug
  useEffect(() => {
    const parent = container.current.parentNode;
    parent.style.position = "relative";

    const parentStyles = getComputedStyle(parent);

    const getPadding = (position) => {
      return parseInt(parentStyles.getPropertyValue(`padding-${position}`).replace("px", ""), 10);
    };

    setParentPadding({
      paddingX: `${getPadding("top") + getPadding("bottom")}px`,
      paddingY: `${getPadding("left") + getPadding("right")}px`,
    });
  }, []);

  return (
    <Box
      position="absolute"
      sx={{ width: `calc(100% - ${paddingX})`, height: `calc(100% - ${paddingY})` }}
      ref={container}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
