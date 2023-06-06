import { object, string, number, array, transform } from "yup";
import { contactSchema } from "@contacts/schemas/contact-schema";

const addressSchema = object().shape({
  street: string().required("Street address is required"),
  suburb: string().required("Suburb is required"),
  postCode: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .required("Post code is required"),
});

const groupTypeSchema = object()
  .transform((groupType) => {
    return groupType ? JSON.parse(groupType) : "";
  })
  .shape({
    id: string().required("Please select a group Type"),
    type: string().required(""),
    price: object().shape({
      id: string().required(),
    }),
  });

const newGroupSchema = object().shape({
  name: string().required("Group name is required"),
  // groupType: string().required("Please select a group Type"),
  groupType: groupTypeSchema,
  address: addressSchema,
  contacts: array().of(contactSchema),
});

export { newGroupSchema };
