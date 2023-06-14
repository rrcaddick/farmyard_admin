const isRetryCode = (statusCode) => {
  return /^5\d{2}$/.test(statusCode);
};
