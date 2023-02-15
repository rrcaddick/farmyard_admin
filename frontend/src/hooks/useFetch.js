import { useState } from "react";

const useFetch = (onComplete) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  const sendRequest = async (url, body) => {
    try {
      setLoading(true);
      setServerError(null);
      setSuccess(false);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(body),
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
