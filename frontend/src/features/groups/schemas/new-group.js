import { object, string, number, array } from "yup";
import { contactSchema } from "@contacts/schemas/contactSchema";

const addressSchema = object().shape({
  street: string().required("Street address is required"),
  suburb: string().required("Suburb is required"),
  postCode: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .required("Post code is required"),
});

const newGroupSchema = object().shape({
  name: string().required("Group name is required"),
  groupType: string().required("Please select a group Type"),
  address: addressSchema,
  contacts: array().of(contactSchema),
});

export { newGroupSchema };
