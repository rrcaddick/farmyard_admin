import * as yup from "yup";

const newGroupSchema = yup.object({
  name: yup.string().required("Group name is required"),
  groupType: yup.string().required("Please select a group Type"),
  street: yup.string().required("Street address is required"),
  suburb: yup.string().required("Suburb is required"),
  postCode: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .required("Post code is required"),
});

export { newGroupSchema };
