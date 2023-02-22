import styled from "@mui/material/styles/styled";

const SyledHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // Keeps content under the app bar
  ...theme.mixins.toolbar,
}));

const Header = ({ children }) => {
  return <SyledHeader>{children}</SyledHeader>;
};

export default Header;
