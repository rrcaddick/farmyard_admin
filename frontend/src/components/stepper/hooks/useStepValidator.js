import { useState } from "react";

const useStepValidator = (validateFn) => {
  const [stepValid, setStepValid] = useState(false);
  const validate = async () => {
    const isValid = await validateFn();
    setStepValid(isValid);
  };

  return [stepValid, validate];
};

export { useStepValidator };
