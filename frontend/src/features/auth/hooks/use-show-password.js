import { useState } from "react";

// TODO: Refactor
const useShowPassword = () => {
  const defaultState = {
    showCurrentPassword: false,
    showPassword: false,
    showConfirmPassword: false,
  };
  const [{ showCurrentPassword, showPassword, showConfirmPassword }, setVisible] = useState(defaultState);

  const toggleShowCurrentPassword = () => {
    setVisible((prevState) => ({ ...prevState, showCurrentPassword: !prevState.showCurrentPassword }));
  };
  const toggleShowPassword = () => {
    setVisible((prevState) => ({ ...prevState, showPassword: !prevState.showPassword }));
  };
  const toggleShowConfirmPassword = () => {
    setVisible((prevState) => ({ ...prevState, showConfirmPassword: !prevState.showConfirmPassword }));
  };

  const resetVisibility = () => {
    setVisible(defaultState);
  };

  return {
    showCurrentPassword,
    showPassword,
    showConfirmPassword,
    toggleShowCurrentPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    resetVisibility,
  };
};

export { useShowPassword };
