const formatYupError = (error) => {
  return error.inner.reduce((errs, err) => {
    return { ...errs, [err.path]: err.message };
  }, {});
};

module.exports = {
  formatYupError,
};
