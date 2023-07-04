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
  getOptionValue,
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
              value: getOptionValue ? getOptionValue(options, value) : value,
              renderOption: (props, option, { index }) => {
                return (
                  <li {...props} key={option?.id ?? index}>
                    {option?.name ?? option}
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
