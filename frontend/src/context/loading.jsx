import { createContext, useCallback, useMemo, useState } from "react";

export const LoadingContext = createContext({
  startLoading: () => {},
  endLoading: () => {},
  isLoading: false,
});

const LoadingProvider = ({ children, initLoading = false }) => {
  const [isLoading, setIsLoading] = useState(initLoading);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const endLoading = useCallback(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const value = useMemo(
    () => ({
      startLoading,
      endLoading,
      isLoading,
    }),
    [startLoading, endLoading, isLoading]
  );

  return <LoadingContext.Provider {...{ value }}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
