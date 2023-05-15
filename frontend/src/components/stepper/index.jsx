import { useState, Children, useMemo, cloneElement } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";

const HorizontalStepper = ({ onComplete = null, children }) => {
  const { stepLabels, buttonLabel, isValid } = useMemo(
    () =>
      Children.toArray(children).reduce(
        (stepInfo, child) => {
          if (child?.type?.name !== "Step" && child?.type?.name !== "CompleteStep")
            throw new Error("Horizontal Stepper can only contain Step and CompleteStep children");

          if (child?.type?.name === "CompleteStep") {
            const buttonLabel = child?.props?.buttonLabel || "";
            return { ...stepInfo, buttonLabel };
          }

          const stepLabel = child?.props?.stepLabel || "";
          const isValid = child.props.isValid === undefined ? true : child.props.isValid;
          return {
            ...stepInfo,
            stepLabels: [...stepInfo.stepLabels, stepLabel],
            isValid: [...stepInfo.isValid, isValid],
          };
        },
        { stepLabels: [], buttonLabel: "", isValid: [] }
      ),
    [children]
  );

  let stepIndex = 0;

  const [activeStep, setActiveStep] = useState(0);

  const nextHandler = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const backHandler = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetHandler = () => {
    setActiveStep(0);
  };

  const onCompletHandler = () => {
    resetHandler();
    onComplete && onComplete();
  };

  const stepsComplete = activeStep === stepLabels.length;

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {stepLabels.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box display="flex" flexDirection="column" flexGrow={1} overflow="hidden">
        {Children.map(children, (child) => {
          if (stepsComplete && child.type.name === "CompleteStep") return child;
          const stepChild = cloneElement(child, { ...child.props, step: stepIndex });
          stepIndex++;
          if (activeStep === stepChild.props.step) return stepChild;
        })}
      </Box>
      <Box sx={{ display: "flex", pt: 2, justifyContent: "space-between" }}>
        <Button color="inherit" disabled={activeStep === 0} onClick={stepsComplete ? resetHandler : backHandler}>
          {stepsComplete ? "Reset" : "Back"}
        </Button>
        <Button
          variant="contained"
          disabled={!isValid[activeStep]}
          sx={{ fontWeight: 900 }}
          onClick={stepsComplete ? onCompletHandler : nextHandler}
        >
          {stepsComplete ? buttonLabel : "Next"}
        </Button>
      </Box>
    </>
  );
};

export default HorizontalStepper;
