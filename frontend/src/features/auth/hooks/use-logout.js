import { useCallback, useContext, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useFetch } from "@hooks/use-fetch";
import { removeRememberMe } from "@utils/auth";
import { LoadingContext } from "@context/loading";

const useLogout = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const { sendRequest } = useFetch();
  const { startLoading, endLoading } = useContext(LoadingContext);

  const logout = useCallback(async () => {
    startLoading();
    const response = await sendRequest("GET", "/logout");
    client.clearStore();
    client.setToken = undefined;
    removeRememberMe(true);

    if (!response.ok) {
      navigate("/login", { state: { logoutError: true } });
    } else {
      navigate("/login");
    }
    endLoading();
  }, [sendRequest, endLoading, navigate, startLoading, client]);

  return logout;
};

export { useLogout };
