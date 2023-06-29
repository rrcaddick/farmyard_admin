import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const AutoCompleteInput = ({
  serverError,
  clearServerError,
  onChange,
  defaultValue = "",
  name,
  label,
  options = [],
  renderInput,
  getOptionLabel,
  isOptionEqualToValue,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      render={({ field: { name, onBlur, onChange: onChangeRHF, ref, value }, fieldState: { error }, formState }) => {
        return (
          <Autocomplete
            {...{
              name,
              options,
              getOptionLabel,
              isOptionEqualToValue,
              onBlur,
              renderOption: (props, option) => {
                return (
                  <li {...props} key={option.id ?? "1"}>
                    {option.name}
                  </li>
                );
              },
              renderInput: (params) => (
                <TextField
                  label={label}
                  error={!!error}
                  helperText={error?.message}
                  variant="standard"
                  inputRef={ref}
                  {...params}
                />
              ),
              onChange: (e, data) => {
                const { id } = data || {};
                onChange && onChange(e, data);
                onChangeRHF(id);
              },
              ...props,
            }}
          />
        );
      }}
    />
  );
};

export default AutoCompleteInput;
