import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const SelectInput = ({
  name,
  placeholder,
  label,
  selectItems,
  variant = "outlined",
  defaultValue = "",
  formControlProps = null,
  inputLabelProps = null,
  onChange = () => {},
  inputProps = null,
  serverError = null,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      render={({ field: { name, onBlur, onChange: onChangeForm, ref: inputRef, value }, fieldState: { error } }) => (
        <FormControl error={!!error || !!serverError} {...formControlProps}>
          <InputLabel {...inputLabelProps} sx={{ marginLeft: "-14px", marginTop: "4px" }}>
            {label}
          </InputLabel>
          <Select
            // tabIndex={2}
            {...{ name, onBlur, value, label, variant, inputRef, defaultValue }}
            {...(inputProps && { inputProps })}
            {...props}
            onChange={(e) => {
              onChange(e);
              onChangeForm(e.target.value);
            }}
          >
            {selectItems.map(({ id, text }) => (
              <MenuItem value={id} key={id}>
                {text}
              </MenuItem>
            ))}
          </Select>
          {(!!error || !!serverError) && (
            <FormHelperText sx={{ marginLeft: 0 }}>{error?.message || serverError}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectInput;
