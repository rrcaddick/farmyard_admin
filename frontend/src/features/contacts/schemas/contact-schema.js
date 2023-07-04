import { object, string, lazy } from "yup";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { isValidObjectId } from "@utils/mongodb";

const contactSchema = object().shape({
  // type: string(),
  // name: string().required("Contact name is required"),
  // email: lazy((value) => {
  //   if (!!value) {
  //     return string().email("Invalid email address");
  //   }
  //   return string().when("tel", {
  //     is: (tel) => {
  //       return !tel || tel.length === 0;
  //     },
  //     then: () => string().required("At least 1 contact method is required"),
  //   });
  // }),
  // tel: lazy((value) => {
  //   if (!!value) {
  //     const number = value.slice(0, 3) === ("+27" || "27") ? value : `+27${value}`;
  //     return !!isValidPhoneNumber(number)
  //       ? string().transform(() => {
  //           const phoneNumber = parsePhoneNumber(number);
  //           return phoneNumber.nationalNumber;
  //         })
  //       : string().test("PhoneNumber", "Invalid phone number", () => false);
  //   }
  //   return string().when("email", {
  //     is: (email) => {
  //       return !email || email.length === 0;
  //     },
  //     then: () => string().required("At least 1 contact method is required"),
  //   });
  // }),
  // groupId: string().when("type", {
  //   is: (value) => value === "Group",
  //   then: () =>
  //     string()
  //       .required("Group is required")
  //       .test("ObjectId", "Invalid Group", (value) => isValidObjectId(value)),
  // }),
});

export { contactSchema };
