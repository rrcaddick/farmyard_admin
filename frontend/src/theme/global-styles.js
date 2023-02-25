const globalStyles = (theme) => ({
  html: {
    height: "100%",
    width: "100%",
  },
  body: {
    height: "100%",
    width: "100%",
  },
  "#root": {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  "::-webkit-scrollbar": {
    width: "10px",
  },
  "::-webkit-scrollbar-track": {
    background: "#e0e0e0",
  },
  "::-webkit-scrollbar-thumb": {
    background: "#888",
  },
  "::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
  a: {
    textDecoration: "none",
    color: "inherit",
  },
  "a:hover": {
    textDecoration: "underline",
  },
  "a:visited": {
    color: "inherit",
  },
  "a:active": {
    color: "inherit",
  },
});

export { globalStyles };
