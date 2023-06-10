import { useCallback } from "react";
import { useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@hooks/use-fetch";
import { removeRememberMe } from "@utils/auth";
import { useLoadingContext } from "@components/loading/use-loading";

const useLogout = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const { sendRequest } = useFetch();
  const { toggleLoading } = useLoadingContext();

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

  return logout;
};

export { useLogout };
