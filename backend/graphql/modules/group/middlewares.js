const { validate } = require("../../middleware/validate");
const { createGroupSchema, updateGroupSchema, createSchema } = require("./schemas");
const { Contact } = require("../../../models/contact");

const checkUpdateForContacts = async ({ args, context }, next) => {
  const { contacts } = args?.input;

  const hasEmailOrTel = contacts.some((contact) => contact?.hasOwnProperty("email") || contact?.hasOwnProperty("tel"));

  if (hasEmailOrTel) {
    // Filters out null contacts, and contacts that are updating both email and tel
    const contactIds = contacts.reduce((groupContacts, contact) => {
      if (contact?.email && contact?.tel) return groupContacts;
      return contact ? [...groupContacts, contact.id] : groupContacts;
    }, []);
    const groupContacts = await Contact.find({ _id: contactIds });
    context.contacts = groupContacts;
  }

  return next();
};

const middlewares = {
  Mutation: {
    createGroup: [validate(createGroupSchema)],
    updateGroup: [checkUpdateForContacts, validate(updateGroupSchema)],
  },
};

module.exports = {
  middlewares,
};
