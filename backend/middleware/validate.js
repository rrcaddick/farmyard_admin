const asyncHandler = require("express-async-handler");

const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    const { body } = req;
    try {
      await schema.validate(body, { abortEarly: false });
      return next();
    } catch (error) {
      res.status(422);
      req.validationErrors = error.inner.reduce(
        (errors, { name, message }) => (name === "ValidationError" ? [...errors, message] : errors),
        []
      );
      throw new Error(error.message);
    }
  });

module.exports = {
  validate,
};
