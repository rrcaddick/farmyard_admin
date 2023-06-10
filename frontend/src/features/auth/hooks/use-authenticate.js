import { useApolloClient } from "@apollo/client";
import { useLoadingContext } from "@components/loading/use-loading";
import { useFetch } from "@hooks/use-fetch";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { removeRememberMe } from "@utils/auth";
import { useApolloCache } from "@hooks/use-apollo-cache";
import { getMe } from "@auth/graphql/queries";

const useAuthenticate = () => {
  const client = useApolloClient();
  const { sendRequest } = useFetch();
  const { toggleLoading } = useLoadingContext();
  const navigate = useNavigate();
  const cache = useApolloCache();

  const login = useCallback(
    async (loginData) => {
      toggleLoading(true);
      const response = await sendRequest("POST", "/login", loginData);
      // Write user to apollo cache
      if (response.success) {
        cache.write(getMe, "User", response.data);
        navigate("/");
      }
      // TODO: Check for authentication error or network error
      if (!response.success) {
        navigate("/login", { state: { loginError: response.message } });
      }
      toggleLoading(false);
    },
    [toggleLoading, sendRequest, cache, navigate]
  );

  const logout = useCallback(async () => {
    toggleLoading(true);
    const { success } = await sendRequest("GET", "/logout");
    client.clearStore();
    client.setToken = undefined;
    removeRememberMe(true);

    if (!success) {
      navigate("/login", { state: { logoutError: true } });
    } else {
      navigate("/login");
    }
    toggleLoading(false);
  }, [sendRequest, navigate, client, toggleLoading]);

  return {
    login,
    logout,
  };
};

export default useAuthenticate;
