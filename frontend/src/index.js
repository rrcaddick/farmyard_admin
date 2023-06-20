import App from "./App";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { SnackbarProvider } from "notistack";
import { createApolloClient } from "./graphql";
import Snackbar from "@components/snackbar";

const client = createApolloClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <SnackbarProvider
        maxSnack={10}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        Components={{
          undo: Snackbar,
          retry: Snackbar,
        }}
      >
        <App />
      </SnackbarProvider>
    </ApolloProvider>
  </BrowserRouter>
);
