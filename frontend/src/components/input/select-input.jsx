import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const SelectInput = ({
  name,
  placeholder,
  label,
  selectItems,
  variant = "outlined",
  defaultValue = undefined,
  formControlProps = null,
  inputLabelProps = null,
  selectProps = null,
  onChange = () => {},
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      render={({
        field: { name, onBlur, onChange: onChangeForm, ref: inputRef, value },
        fieldState: { error },
        formState,
      }) => (
        <FormControl error={!!error} {...formControlProps}>
          <InputLabel {...inputLabelProps}>{label}</InputLabel>
          <Select
            {...{ name, onBlur, value, label, variant, inputRef, defaultValue }}
            {...selectProps}
            onChange={(e) => {
              onChange(e);
              onChangeForm(e.target.value);
            }}
          >
            {selectItems.map(({ id, text }) => (
              <MenuItem value={id}>{text}</MenuItem>
            ))}
          </Select>
          {!!error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default SelectInput;
