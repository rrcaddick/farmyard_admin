import _ from "lodash";
import { useCallback, useState } from "react";

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

  const startRequestState = useCallback(() => {
    setError(null);
    setLoading(true);
  }, []);

  const sendRequest = useCallback(
    async (url, fetchOptions = {}, { shouldRetry = false, retries = 0 }) => {
      startRequestState();
      try {
        const { body, ...options } = fetchOptions;

        const response = await fetch(
          url,
          _.merge({}, defaultOptions, { ...options, ...(body && { body: JSON.stringify(body) }) })
        );

        if (response.ok) {
          const responseData = await response.json();
          return { data: responseData, success: true };
        }

        if (isRetryCode(response.status) && shouldRetry && retries > 0) {
          return sendRequest(url, options, retries - 1);
        }

        if (isClientCode(response.status)) {
          const { message } = await response.json();
          setError(message);
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

  return { sendRequest, loading, error };
};

export default useFetch;
