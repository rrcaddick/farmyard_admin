const { validate } = require("../../middleware/validate");
const { createContactSchema, updateContactSchema } = require("./schemas");

const middlewares = {
  Mutation: {
    createContact: [validate(createContactSchema)],
    updateContact: [validate(updateContactSchema)],
  },
};

module.exports = {
  middlewares,
};
