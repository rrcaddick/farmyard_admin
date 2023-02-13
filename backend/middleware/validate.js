const asyncHandler = require("express-async-handler");

const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    try {
      await schema.validate(req, { abortEarly: false });
      return next();
    } catch (error) {
      const isLogin = req.url === "/login";
      if (!isLogin) req.validationErrors = validationErrors;
      res.status(isLogin ? 401 : 422);
      throw new Error(error.message);
    }
  });

module.exports = {
  validate,
};
