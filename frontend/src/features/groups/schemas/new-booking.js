import * as yup from "yup";

const newBookingSchema = yup.object({
  bookingDate: yup.number().required("Please select a booking date"),
  visitorCount: yup
    .number()
    .positive()
    .min(40, "Group bookings should be 40 or more")
    .required("How many visitors are planned")
    .typeError("Visitors should be a number"),
  contactName: yup.string().required("Please enter a contact name"),
  groupType: yup.number(),
  ageGroup: yup.number(),
});

export { newBookingSchema };
