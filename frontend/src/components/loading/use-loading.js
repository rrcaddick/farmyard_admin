import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import LoadingBase from "./loading-base";

export const LoadingContext = createContext({
  loading: false,
  toggleLoading: () => {},
});

const useLoading = (initState = false) => {
  const [loading, setLoading] = useState(initState);

  useEffect(() => {
    setLoading(initState);
  }, [initState]);

  const toggleLoading = useCallback((state) => {
    setLoading((loading) => {
      const isLoading = state ?? !loading;
      return isLoading;
    });
  }, []);

  const value = useMemo(
    () => ({
      loading,
      toggleLoading,
    }),
    [loading, toggleLoading]
  );

  const Loading = useCallback(
    ({ children, container, animation }) => (
      <LoadingContext.Provider {...{ value }}>
        <LoadingBase {...{ ...value, children, container, animation }} />
      </LoadingContext.Provider>
    ),
    [value]
  );

  return { loading, toggleLoading, Loading };
};

export const useLoadingContext = (initState = false) => {
  const context = useContext(LoadingContext);
  const { toggleLoading } = context;

  useEffect(() => {
    toggleLoading(initState);
  }, [toggleLoading, initState]);

  return context;
};

export default useLoading;
