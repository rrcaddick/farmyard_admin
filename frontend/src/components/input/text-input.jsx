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
  onChange = null,
  variant = "outlined",
  InputProps = null,
  defaultValue = "",
  number = false,
  tabIndex = null,
  serverError = null,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      rules={{ validate }}
      render={({ field: { name, onBlur, onChange: onChangeRHF, ref, value }, fieldState: { error }, formState }) => {
        return (
          <TextField
            inputRef={ref}
            error={!!error || !!serverError}
            onChange={(e) => {
              onChange && onChange(e);
              onChangeRHF(e);
            }}
            {...{
              name,
              onBlur,
              value,
              type,
              placeholder,
              label,
              variant,
            }}
            {...((!!error || !!serverError) && { helperText: error?.message || serverError })}
            {...(InputProps && { InputProps })}
            {...props}
          />
        );
      }}
    />
  );
};

export default TextInput;
