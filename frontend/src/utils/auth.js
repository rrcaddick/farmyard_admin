const getRememberMe = () => {
  const rememberMe = localStorage.getItem("rememberMe");

  if (!rememberMe) {
    localStorage.setItem("rememberMe", "false");
    return false;
  }

  return rememberMe === "true";
};

const toggleRememberMe = () => {
  const rememberMe = localStorage.getItem("rememberMe");

  rememberMe === "true" ? localStorage.setItem("rememberMe", "false") : localStorage.setItem("rememberMe", "true");
};

const removeRememberMe = () => {
  localStorage.removeItem("rememberMe");
};

export { getRememberMe, toggleRememberMe, removeRememberMe };
