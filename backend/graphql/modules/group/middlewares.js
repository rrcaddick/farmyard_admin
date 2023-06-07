const { validate } = require("../../middleware/validate");
const { createGroupSchema, updateGroupSchema } = require("./schemas");

const middlewares = {
  Mutation: {
    createGroup: [validate(createGroupSchema)],
    updateGroup: [validate(updateGroupSchema)],
  },
};

module.exports = {
  middlewares,
};
