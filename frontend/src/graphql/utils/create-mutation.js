import { useMutation } from "@apollo/client";
import { useState } from "react";

const createMutation = (mutation, updateFn) => (onCompelteFn) => {
  const [serverErrors, setServerErrors] = useState({});

  const [mutate, { loading }] = useMutation(mutation, {
    onError: ({ graphQLErrors }) => {
      if (graphQLErrors?.length > 0) {
        const { data: errors } = graphQLErrors[0];
        setServerErrors(errors);
      }
    },
    onCompleted: (data) => {
      onCompelteFn(data);
    },
    update: updateFn,
  });

  const clearServerErrors = () => {
    setServerErrors({});
  };

  return {
    loading,
    serverErrors,
    clearServerErrors,
    mutate,
  };
};

export { createMutation };
