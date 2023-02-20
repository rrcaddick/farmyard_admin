import { useState, useEffect } from "react";

const useRememberMe = () => {
  const [rememberMe, setRememberMe] = useState();

  useEffect(() => {
    const _rememberMe = localStorage.getItem("rememberMe");
  });

  return {};
};

export { useRememberMe };
