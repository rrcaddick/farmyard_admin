import { object, string, lazy } from "yup";
import parsePhoneNumber from "libphonenumber-js";
import { isValidObjectId } from "@utils/mongodb";

const contactSchema = object().shape({
  type: string(),
  name: string().required("Contact name is required"),
  email: lazy((value) => {
    if (!!value) {
      return string().email("Invalid email address");
    }
    return string().when("tel", {
      is: (tel) => {
        return !tel || tel.length === 0;
      },
      then: () => string().required("At least 1 contact method is required"),
    });
  }),
  tel: lazy((value) => {
    if (!!value) {
      const phoneNumber = parsePhoneNumber(value, "ZA");
      return phoneNumber?.isValid()
        ? string().transform(() => {
            return `0${phoneNumber.nationalNumber}`;
          })
        : string().test("PhoneNumber", "Invalid phone number", () => false);
    }
    return string().when("email", {
      is: (email) => {
        return !email || email.length === 0;
      },
      then: () => string().required("At least 1 contact method is required"),
    });
  }),
  groupId: string().when("type", {
    is: (value) => value === "Group",
    then: () =>
      string()
        .required("Group is required")
        .test("ObjectId", "Invalid Group", (value) => isValidObjectId(value)),
    otherwise: () => string().transform(() => undefined),
  }),
});

export { contactSchema };
