import { object, string, number, array } from "yup";
import { contactSchema } from "@contacts/schemas/contact-schema";

const addressSchema = object().shape({
  street: string().required("Street address is required"),
  suburb: string().required("Suburb is required"),
  postCode: number()
    .transform((value) => {
      return isNaN(value) ? undefined : Number(value);
    })
    .nullable()
    .required("Post code is required"),
});

const groupTypeSchema = object()
  .transform((groupType) => {
    return groupType ? JSON.parse(groupType) : "";
  })
  .shape({
    id: string().required("GroupType.id is required"),
    type: string().required("GroupType.type is required"),
    price: string().required("GroupType.price.id is required"),
  })
  .typeError("Please select a group Type");

const newGroupSchema = object().shape({
  name: string().required("Group name is required"),
  groupType: groupTypeSchema,
  address: addressSchema,
  contacts: array().of(contactSchema),
});

export { newGroupSchema };
