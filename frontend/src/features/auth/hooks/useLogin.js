import { useState } from "react";
// import { useApolloClient } from "@apollo/client";

const useLogin = () => {
  // Stops fetch from being overidden to expose token
  const secureFetch = window.fetch;

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  // const client = useApolloClient();

  const login = async (loginData) => {
    try {
      setLoading(true);
      setServerError(null);
      setSuccess(false);

      const response = await secureFetch("/login", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setServerError(message);
      } else {
        const { token } = await response.json();
        // client.setToken(token);
        // client.setConnectionParams({ token });
        setSuccess(true);
      }
    } catch (err) {
      setServerError("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, serverError, success };
};

export { useLogin };
