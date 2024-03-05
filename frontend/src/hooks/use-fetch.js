import _ from "lodash";
import { useCallback, useState } from "react";
import { useApolloClient } from "@apollo/client";

const defaultOptions = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const isRetryCode = (statusCode) => {
  return /^5\d{2}$/.test(statusCode);
};

const isClientCode = (statusCode) => {
  return /^4\d{2}$/.test(statusCode);
};

const useFetch = () => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const startRequestState = useCallback(() => {
    setError(null);
    setLoading(true);
  }, []);

  const client = useApolloClient();
  const locaFetch = client.getFetch();

  const sendRequest = useCallback(
    async (url, { retries = 0, ...fetchOptions } = {}) => {
      startRequestState();
      try {
        const { body, ...options } = fetchOptions;

        const response = await locaFetch(
          url,
          _.merge({}, defaultOptions, { ...options, ...(body && { body: JSON.stringify(body) }) })
        );

        if (response.ok) {
          const responseData = await response.json();
          setSuccess(true);
          return { data: responseData, success: true };
        }

        if (isRetryCode(response.status) && retries > 0) {
          return sendRequest(url, options, { ...fetchOptions, retries: retries - 1 });
        }

        if (isClientCode(response.status)) {
          const { message } = await response.json();
          setError(message);
          setSuccess(false);
          return { message, success: false };
        }

        throw new Error(
          "Oops! Something went wrong. Please try again, or contact your system administrator if the error persists"
        );
      } catch ({ message }) {
        setError(message);
        return { message, success: false };
      } finally {
        setLoading(false);
      }
    },
    [startRequestState]
  );

  return { sendRequest, loading, error, success };
};

export default useFetch;
