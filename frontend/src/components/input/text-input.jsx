import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const validate = (value) => {
  const matches = value.match(/^(?:0\.(?:0[0-9]|[0-9]\d?)|[0-9]\d*(?:\.\d{1,2})?)(?:e[+-]?\d+)?$/);
  return matches?.length > 0 || "Not a Number";
};

const TextInput = ({
  name,
  type = "text",
  placeholder,
  label,
  variant = "outlined",
  InputProps = null,
  defaultValue = "",
  number = false,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      rules={{ validate }}
      render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error }, formState }) => (
        <TextField
          inputRef={ref}
          error={!!error}
          {...{ name, onBlur, value, onChange, type, placeholder, label, variant }}
          {...(!!error && { helperText: error.message })}
          {...(InputProps && { InputProps })}
          {...props}
        />
      )}
    />
  );
};

export default TextInput;
