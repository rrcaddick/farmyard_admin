import { useApolloClient } from "@apollo/client";
import { useState, useCallback } from "react";

const useFetch = (onComplete) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const client = useApolloClient();

  const safeFetch = client.getFetch();

  const sendRequest = useCallback(
    async (method, url, body = null) => {
      try {
        setLoading(true);
        setServerError(null);
        setSuccess(false);

        const response = await safeFetch(url, {
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
          return { message, success: false };
        } else {
          const responseData = await response.json();
          onComplete && onComplete(responseData);
          setSuccess(true);
          return { data: responseData, success: true };
        }
      } catch (err) {
        setServerError("Something went wrong. Please try again");
      } finally {
        setLoading(false);
      }
    },
    [onComplete, safeFetch]
  );

  return { sendRequest, loading, serverError, success };
};

export { useFetch };
