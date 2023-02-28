import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const TextInput = ({ name, type = "text", placeholder, label, variant = "standard", InputProps = null }) => {
  const { control } = useFormContext();

  return (
    <Controller
      defaultValue=""
      {...{ control, name }}
      render={({ field: { name, onBlur, onChange, ref, value }, fieldState: { error }, formState }) => (
        <TextField
          inputRef={ref}
          error={!!error}
          {...{ name, onBlur, onChange, value, type, placeholder, label, variant }}
          {...(!!error && { helperText: error.message })}
          {...(InputProps && { InputProps })}
        />
      )}
    />
  );
};

export default TextInput;
