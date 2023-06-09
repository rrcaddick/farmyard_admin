import { useRef } from "react";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import HorizontalStepper from "@components/stepper";
import Step from "@components/stepper/step";
import CompleteStep from "@components/stepper/complete-step";
import { useForm, FormProvider } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { newBookingSchema } from "@booking/schemas/new-booking";
import TextInput from "@components/input/text-input";
import CalendarPicker from "@components/input/calendar-picker";
import { Box } from "@mui/material";
import NumberInput from "@components/input/number-input";
import { useStepValidator } from "@components/stepper/hooks/useStepValidator";

import GroupSelection from "./group-selection";
import { useModalContext } from "@components/modal/use-modal";

const Form = styled.form`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
`;

const NewBooking = () => {
  const formRef = useRef();
  const resolver = useYupValidationResolver(newBookingSchema);
  const formMethods = useForm({ resolver, mode: "all", defaultValues: { visitorCount: 40 } });
  const { handleSubmit, trigger } = formMethods;
  const { close } = useModalContext();

  const submitHandler = (data) => {
    console.log(data);
    close();
  };

  const onComplete = () => {
    formRef?.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };

  const [stepOneValid, validateStepOne] = useStepValidator(async () => await trigger(["bookingDate", "visitorCount"]));

  return (
    <FormProvider {...formMethods}>
      <Form ref={formRef} onSubmit={handleSubmit(submitHandler)} noValidate>
        <HorizontalStepper onComplete={onComplete}>
          {/* Availability and Visitor Count */}
          <Step stepLabel="Availability" isValid={stepOneValid}>
            <Box
              display="flex"
              justifyItems="flex-start"
              padding={0}
              paddingTop={2}
              flexGrow={1}
              gap={1}
              overflow="auto"
            >
              <Box display="flex" flexDirection="column" justifyContent="space-between" p={2}>
                <Box flex={1}>
                  <CalendarPicker name="bookingDate" validate={validateStepOne} />
                </Box>
                <NumberInput
                  name="visitorCount"
                  label="Visitors"
                  placeholder="Number of visitors"
                  defaultValue={null}
                  validate={validateStepOne}
                />
              </Box>
              {/* <Box flexGrow={1} display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" flex={6} gap={1}>
                    <Paper sx={{ flex: 1, p: 1 }}>
                      <Typography variant="h4">Bookings</Typography>
                      <Typography variant="h6">Primary School - Grade 2: 780</Typography>
                      <Typography variant="h6">Primary School - Grade 10: 200</Typography>
                      <Typography variant="h6">High School - Grade 10: 300</Typography>
                    </Paper>
                    <Paper sx={{ flex: 1, p: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <PoolSunburst data={sunBurstData} />
                    </Paper>
                    <Paper sx={{ flex: 1, p: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <PoolSunburst data={sunBurstData} />
                    </Paper>
                  </Box>
                  <Paper sx={{ flex: 4, p: 1 }}>
                    <BookingsBarGraph
                      data={testData}
                      indexBy="date"
                      keys={{ Confirmed: "#4caf50", "Awaiting Confirmation": "#ff9800", Enquiries: "#00796B" }}
                    />
                  </Paper>
                </Box> */}
            </Box>
          </Step>

          {/* Group */}
          <Step stepLabel="Group">
            <GroupSelection />
          </Step>

          {/* Contact */}
          <Step stepLabel="Contact">
            <Box display="flex" flexGrow={1} padding={5} gap={5}>
              <Box flexGrow={1} border="1px solid #555" borderRadius="10px" padding={1}>
                <Typography>Ray Caddick</Typography>
                <Typography>Linda Caddick</Typography>
                <Typography>Ashleigh Caddick</Typography>
              </Box>
              <Box display="flex" flexDirection="column" flex={1} gap={2}>
                <TextInput variant="outlined" name="contactName" label="Contact Name" placeholder="Eg: John Doe" />
                <TextInput variant="outlined" name="email" label="Email Address" placeholder="Eg: example@gmail.com" />
                <TextInput variant="outlined" name="tel" label="Contact Number" placeholder="Eg: 073 123 4567" />
              </Box>
            </Box>
          </Step>

          <CompleteStep buttonLabel="Create Booking" buttonType="submit">
            <Typography>Review booking and create</Typography>
          </CompleteStep>
        </HorizontalStepper>
      </Form>
    </FormProvider>
  );
};
export default NewBooking;
