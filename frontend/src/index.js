import { ApolloProvider } from "@apollo/client";
import LoadingProvider from "@context/loading";
import { getRememberMe } from "@utils/auth";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { createApolloClient } from "./graphql";

const client = createApolloClient();
const rememberMe = getRememberMe();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
  <BrowserRouter>
    <ApolloProvider client={client}>
      <LoadingProvider initLoading={rememberMe}>
        <App rememberMe={rememberMe} />
      </LoadingProvider>
    </ApolloProvider>
  </BrowserRouter>
  // </StrictMode>
);
