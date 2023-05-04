import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const TextInput = ({
  name,
  type = "text",
  placeholder,
  label,
  variant = "outlined",
  InputProps = null,
  defaultValue = undefined,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error }, formState }) => (
        <TextField
          inputRef={ref}
          error={!!error}
          {...{ name, onBlur, onChange, value, type, placeholder, label, variant }}
          {...(!!error && { helperText: error.message })}
          {...(InputProps && { InputProps })}
          {...props}
        />
      )}
    />
  );
};

export default TextInput;
