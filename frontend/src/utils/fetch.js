const createSafeFetch = (setToken) => {
  const { fetch: _fetch } = window;

  const fetch = async (...args) => {
    const response = await _fetch(...args);

    const accessToken = response.headers.get("x-access-token");

    if (accessToken) {
      setToken(accessToken);
    }

    return response;
  };

  return fetch;
};

export { createSafeFetch };
