const extractServerError = ({ graphQLErrors, networkError: _networkError }) => {
  let validationErrors;
  let networkError;
  let serverError;

  // TODO: Create error link for all errors. Loop all and check error type
  if (Array.isArray(graphQLErrors)) {
    for (let error of graphQLErrors) {
      const { code, data } = error.extensions;
      if (code !== "BAD_USER_INPUT") {
        serverError = {
          header: "Oops!",
          message: "Something went wrong. You can retry or contact your system administrator",
        };
        break;
      }
      validationErrors = { ...validationErrors, ...data };
    }
  }

  if (_networkError) {
    networkError = {
      header: "Check your connection",
      message: "You don't seem to have an active internet connetion. Please check you router and try again",
    };
  }

  return { ...validationErrors, networkError, serverError };
};

export { extractServerError };
