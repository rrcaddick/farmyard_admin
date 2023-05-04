import { useMemo, useRef } from "react";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import ContainedModal from "@components/modal/contained-modal";
import HorizontalStepper from "@components/stepper";
import Step from "@components/stepper/step";
import CompleteStep from "@components/stepper/complete-step";
import { useForm, FormProvider } from "react-hook-form";
import { useYupValidationResolver } from "@hooks/use-yup-validation-resolver";
import { newBookingSchema } from "@booking/schemas/new-booking";
import TextInput from "@components/input/text-input";
import CalendarPicker from "@components/input/calendar-picker";
import { Box, Divider, IconButton, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import NumberInput from "@components/input/number-input";
import { useStepValidator } from "@components/stepper/hooks/useStepValidator";
import BookingsBarGraph from "@components/graph/bar-graph";
import PoolSunburst from "@components/graph/sun-burst";
import { testData } from "../../../../testdata";
import { data as sunBurstData } from "../../../../sunburst-test-data";
import AddIcon from "@mui/icons-material/Add";
import SelectInput from "@components/input/select-input";

const Form = styled.form`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  border-radius: 10px;
  overflow: auto;
`;

const groupTypeOptions = [
  { id: "1", text: "School" },
  { id: "2", text: "Church" },
  { id: "3", text: "NPO" },
  { id: "4", text: "Organization" },
  { id: "5", text: "Other Religious" },
  { id: "6", text: "Other" },
];

const ageGroupOptions = [
  { id: 1, text: "Preschool", groupType: [1] },
  { id: 2, text: "Primary School G1-3", groupType: [1] },
  { id: 3, text: "Primary School G4-7", groupType: [1] },
  { id: 4, text: "Primary School G1-7", groupType: [1] },
  { id: 5, text: "High School", groupType: [1] },
  { id: 6, text: "Special Needs", groupType: [1] },
  { id: 7, text: "Disability", groupType: [1] },
  { id: 8, text: "Sunday School", groupType: [2] },
  { id: 12, text: "Children", groupType: [3, 5, 6] },
  { id: 9, text: "Youth", groupType: [2, 3, 5, 6] },
  { id: 10, text: "Adult", groupType: [2, 3, 5, 6] },
  { id: 11, text: "Family", groupType: [2, 3, 4, 5, 6] },
  { id: 13, text: "Sports - Children", groupType: [4] },
  { id: 14, text: "Sports - Youth", groupType: [4] },
  { id: 15, text: "Corporate", groupType: [4] },
  { id: 16, text: "Government", groupType: [4] },
];

const NewBooking = ({ open, close, container }) => {
  const formRef = useRef();
  const resolver = useYupValidationResolver(newBookingSchema);
  const formMethods = useForm({ resolver, mode: "all", defaultValues: { visitorCount: 40 } });

  const { handleSubmit, trigger, watch } = formMethods;

  const groupType = watch("groupType");
  const options = useMemo(
    () => ageGroupOptions.filter((option) => option.groupType.includes(Number(groupType))),
    [groupType]
  );

  const submitHandler = (data) => {
    console.log(data);
    close();
  };

  const onComplete = () => {
    formRef?.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  };

  const [stepOneValid, validateStepOne] = useStepValidator(async () => await trigger(["bookingDate", "visitorCount"]));

  return (
    <ContainedModal {...{ open, close, container }}>
      <FormProvider {...formMethods}>
        <Form ref={formRef} onSubmit={handleSubmit(submitHandler)} noValidate>
          <HorizontalStepper onComplete={onComplete}>
            <Step stepLabel="Availability" isValid={stepOneValid}>
              <Box display="flex" justifyItems="flex-start" padding={0} paddingTop={2} flexGrow={1} gap={1}>
                <Paper sx={{ display: "flex", flexDirection: "column", p: 1, justifyContent: "space-between" }}>
                  <CalendarPicker name="bookingDate" validate={validateStepOne} />
                  <NumberInput
                    name="visitorCount"
                    label="Visitors"
                    placeholder="Number of visitors"
                    defaultValue={null}
                    validate={validateStepOne}
                  />
                </Paper>
                <Box flexGrow={1} display="flex" flexDirection="column" gap={1}>
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
                </Box>
              </Box>
            </Step>

            <Step stepLabel="Group">
              <Box display="flex" flexGrow={1} padding={2} paddingBottom={0} gap={2}>
                <Paper elevation={10} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <Box
                    p={1}
                    display="flex"
                    justifyItems="space-between"
                    alignItems="center"
                    width="100%"
                    borderBottom="1px solid #888"
                  >
                    <TextField
                      variant="outlined"
                      type="search"
                      label="Search Group"
                      fullWidth
                      placeholder="Eg: New Apostolic"
                    />
                    <IconButton>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <List sx={{ flex: 1, overflowY: "scroll" }}>
                    <ListItem>
                      <ListItemText primary="New Apostolic - Bellville" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Christ Church - Bergvliet" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Boys High - Paarl" />
                    </ListItem>
                  </List>
                </Paper>
                <Divider orientation="vertical" />
                <Box display="flex" flexDirection="column" flex={1} gap={2}>
                  <Paper elevation={10}>
                    <TextInput fullWidth name="groupName" label="Group Name" placeholder="Eg: New Apostolic" />
                  </Paper>
                  <Paper elevation={10}>
                    <TextInput fullWidth name="area" label="Area" placeholder="Eg: Bellville" />
                  </Paper>
                  <Paper elevation={10}>
                    <SelectInput
                      name="groupType"
                      label="Group Type"
                      selectItems={groupTypeOptions}
                      formControlProps={{ fullWidth: true }}
                    />
                  </Paper>
                  <Paper elevation={10}>
                    <SelectInput
                      name="ageGroup"
                      label="Age Group"
                      selectItems={options}
                      formControlProps={{ fullWidth: true }}
                    />
                  </Paper>
                  <Paper elevation={10}>
                    <TextInput fullWidth name="price" label="Price" />
                  </Paper>
                </Box>
              </Box>
            </Step>
            <Step stepLabel="Contact">
              <Box display="flex" flexGrow={1} padding={5} gap={5}>
                <Box flexGrow={1} border="1px solid #555" borderRadius="10px" padding={1}>
                  <Typography>Ray Caddick</Typography>
                  <Typography>Linda Caddick</Typography>
                  <Typography>Ashleigh Caddick</Typography>
                </Box>
                <Box display="flex" flexDirection="column" flex={1} gap={2}>
                  <TextInput variant="outlined" name="contactName" label="Contact Name" placeholder="Eg: John Doe" />
                  <TextInput
                    variant="outlined"
                    name="email"
                    label="Email Address"
                    placeholder="Eg: example@gmail.com"
                  />
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
    </ContainedModal>
  );
};
export default NewBooking;
