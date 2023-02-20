import { ApolloProvider } from "@apollo/client";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createApolloClient } from "./graphql";

const client = createApolloClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
  // </StrictMode>
);
