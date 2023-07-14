const { UserInputError } = require("apollo-server-express");
const { formatYupError } = require("../utils/yup");

const validate =
  (schema) =>
  async ({ root, args, context: { userId } }, next) => {
    let validationObject = args;

    if (typeof args[Object.keys(args)[0] === "object"]) {
      validationObject = args[Object.keys(args)[0]];
    }

    try {
      await schema.validate(validationObject, { abortEarly: false, context: { userId } });
      return next();
    } catch (error) {
      const data = formatYupError(error)
      throw new UserInputError("Validation Failed", { data });
    }
  };

module.exports = {
  validate,
};
