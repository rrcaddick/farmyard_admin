const { validate } = require("../../middleware/validate");
const { groupSchema } = require("./schema");

const middlewares = {
  Mutation: {
    createGroup: [validate(groupSchema)],
  },
};

module.exports = {
  middlewares,
};
