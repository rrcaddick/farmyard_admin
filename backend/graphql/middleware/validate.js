const { UserInputError } = require("apollo-server-express");
const { formatYupError } = require("../utils/yup");

const validate =
  (schema) =>
  async ({ args, context }, next) => {
    let validationObject = args;

    if (typeof args[Object.keys(args)[0] === "object"]) {
      validationObject = args[Object.keys(args)[0]];
    }

    try {
      await schema.validate(validationObject, { abortEarly: false, context });
      return next();
    } catch (error) {
      const data = formatYupError(error);
      throw new UserInputError("Validation Failed", { data });
    }
  };

module.exports = {
  validate,
};
