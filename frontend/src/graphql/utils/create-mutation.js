import { useMutation } from "@apollo/client";
import { useState } from "react";

const createMutation =
  (mutation, updateFn) =>
  (onCompelteFn = null) => {
    const [serverErrors, setServerErrors] = useState({});

    const [mutate, { loading }] = useMutation(mutation, {
      onError: ({ graphQLErrors }) => {
        if (graphQLErrors?.length > 0) {
          const { data: errors } = graphQLErrors[0]?.extensions || {};
          setServerErrors(errors);
        }
      },
      onCompleted: (data) => {
        onCompelteFn && onCompelteFn(data);
      },
      update: updateFn,
    });

    const clearServerError = (name) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, [name]: undefined }));
    };

    return {
      loading,
      serverErrors,
      clearServerError,
      mutate,
    };
  };

export { createMutation };
