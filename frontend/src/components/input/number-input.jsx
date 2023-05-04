import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const NumberInput = ({
  name,
  placeholder,
  label,
  variant = "outlined",
  InputProps = null,
  defaultValue = 0,
  validate,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error, isDirty }, formState }) => (
        <TextField
          inputRef={ref}
          error={!!error && isDirty}
          type="number"
          min={40}
          onChange={async (e) => {
            onChange(e);
            await validate();
          }}
          // helperText=" "
          sx={{
            "& .MuiFormHelperText-root.Mui-error": {
              position: "absolute",
              top: "-60%",
              left: 0,
              margin: 1,
            },
          }}
          {...{ name, onBlur, value, placeholder, label, variant }}
          {...(!!error && isDirty && { helperText: error.message })}
          {...(InputProps && { InputProps })}
        />
      )}
    />
  );
};

export default NumberInput;
