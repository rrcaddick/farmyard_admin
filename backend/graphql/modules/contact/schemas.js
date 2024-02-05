const { isValidObjectId } = require("mongoose");
const { object, string, lazy, addMethod } = require("yup");
const parsePhoneNumber = require("libphonenumber-js");

const hasSavedTel = (context, contactId) => {
  const tel = context?.contacts?.find((contact) => contact.id === contactId)?.tel || undefined;
  return tel && tel !== "";
};

const hasSavedEmail = (context, contactId) => {
  const email = context?.contacts?.find((contact) => contact.id === contactId)?.email || undefined;
  return email && email !== "";
};

const createSchema = (requestType, mutation) => {
  return object()
    .nullable(requestType === "Update")
    .shape({
      type:
        requestType == "Create" && mutation !== "createGroup"
          ? string().required("Contact type is required")
          : string(),
      name: requestType == "Create" ? string().required("Contact name is required") : string(),
      email: lazy((email, { parent, context }) => {
        if (email) {
          return string().email("Invalid email address");
        }
        const { id, tel } = parent;

        // Neither present for udpate
        if (email === undefined && tel === undefined && requestType !== "Create") {
          return string();
        }

        return tel || hasSavedTel(context, id) ? string() : string().required("At least 1 contact method is required");
      }),
      tel: lazy((tel, { parent, context }) => {
        if (!!tel) {
          return string().test("PhoneNumber", "Invalid phone number", (tel) => {
            const phoneNumber = parsePhoneNumber(tel, "ZA");
            return phoneNumber?.isValid();
          });
        }

        const { id, email } = parent;

        // Neither present for udpate
        if (email === undefined && tel === undefined && requestType !== "Create") {
          return string();
        }

        return email || hasSavedEmail(context, id)
          ? string().transform(() => {
              return undefined;
            })
          : string().required("At least 1 contact method is required");
      }),
      groupId:
        requestType === "Create" && mutation !== "createGroup"
          ? string().when("type", {
              is: (value) => value === "Group",
              then: () =>
                string()
                  .test("ObjectId", "Invalid Group", (value) => isValidObjectId(value))
                  .required("Group is required"),
            })
          : string(),
    });
};

module.exports = {
  createSchema,
};
