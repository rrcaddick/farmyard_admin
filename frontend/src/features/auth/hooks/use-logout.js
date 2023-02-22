import { useCallback, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@hooks/use-fetch";
import { removeRememberMe } from "@utils/auth";

const useLogout = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const { sendRequest, loading, success, serverError } = useFetch();

  const logout = useCallback(async () => {
    await sendRequest("GET", "/logout");
  }, [sendRequest]);

  useEffect(() => {
    if (loading) {
      // TODO: Add context to show loading screen
    }

    if (success || serverError) {
      client.clearStore();
      client.setToken = undefined;
      removeRememberMe(true);
    }

    if (success) {
      // Normal navigate to login
      navigate("/login");
    }

    if (serverError) {
      // Modal warning to clear cookies
      navigate("/login", { state: { logoutError: true } });
    }
  }, [loading, success, serverError, client, navigate]);

  return logout;
};

export { useLogout };
