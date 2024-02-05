const { validate } = require("../../middleware/validate");
const { createSchema } = require("./schemas");

const middlewares = {
  Mutation: {
    createContact: [validate(createSchema("Create"))],
    updateContact: [validate(createSchema("Update"))],
  },
};

module.exports = {
  middlewares,
};
