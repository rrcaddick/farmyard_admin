import { useApolloClient } from "@apollo/client";
import { useState, useEffect } from "react";

const useFetch = (onComplete) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const client = useApolloClient();

  // Overrides fetch to retrieve response headers
  useEffect(() => {
    const { fetch: _fetch } = window;

    window.fetch = async (...args) => {
      const response = await _fetch(...args);

      const accessToken = response.headers.get("x-access-token");

      if (accessToken) {
        client.setToken(accessToken);
      }

      return response;
    };

    return () => {
      window.fetch = _fetch;
    };
  });

  const sendRequest = async (method, url, body = null) => {
    try {
      setLoading(true);
      setServerError(null);
      setSuccess(false);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method,
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        setServerError(message);
      } else {
        const responseData = await response.json();
        onComplete && onComplete(responseData);
        setSuccess(true);
        return responseData;
      }
    } catch (err) {
      setServerError("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading, serverError, success };
};

export { useFetch };
