import { useMutation } from "@apollo/client";
import { useState } from "react";

const createMutation =
  (mutation, updateFn) =>
  (onCompelteFn = null) => {
    const [serverErrors, setServerErrors] = useState({});
    const [complete, setComplete] = useState(false);

    const [apolloMutate, { loading }] = useMutation(mutation, {
      onError: ({ graphQLErrors }) => {
        if (graphQLErrors?.length > 0) {
          const { data: errors } = graphQLErrors[0]?.extensions || {};
          setServerErrors(errors);
        }
      },
      onCompleted: (data) => {
        setComplete(true);
        onCompelteFn && onCompelteFn(data);
      },
      update: updateFn,
    });

    const mutate = (args) => {
      setComplete(false);
      apolloMutate(args);
    };

    const clearServerError = (name) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, [name]: undefined }));
    };

    return {
      loading,
      complete,
      serverErrors,
      clearServerError,
      mutate,
    };
  };

export { createMutation };
