import { useApolloClient } from "@apollo/client";
import { useLoadingContext } from "@components/loading/use-loading";
import useFetch from "@hooks/use-fetch";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { GET_ME } from "@auth/graphql/queries";

const useAuthenticate = () => {
  const client = useApolloClient();
  const cache = useApolloCache();
  const navigate = useNavigate();
  const { sendRequest, loading } = useFetch();
  const { toggleLoading } = useLoadingContext(loading);

  const login = useCallback(
    async (loginData, pathname = "/") => {
      const { data, message } = await sendRequest(
        "/login",
        { method: "POST", body: loginData },
        { shouldRetry: true, retries: 2 }
      );

      if (data) {
        cache.write(GET_ME, "User", data);
        navigate(pathname);
      }

      if (!data) {
        navigate("/login", { state: { loginError: message } });
      }
      toggleLoading(false);
    },
    [sendRequest, cache, navigate, toggleLoading]
  );

  const logout = useCallback(async () => {
    const { message } = await sendRequest("/logout", { method: "GET" }, { shouldRetry: true, retries: 2 });

    await client.clearPersistedCache();

    navigate("/login", { state: { logoutError: message } });

    toggleLoading(false);
  }, [sendRequest, client, navigate, toggleLoading]);

  return {
    login,
    logout,
    loading,
  };
};

export { useAuthenticate };
