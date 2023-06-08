import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import _ from "lodash";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

const SelectInput = ({
  name,
  placeholder,
  label,
  selectItems,
  variant = "standard",
  defaultValue = "",
  formControlProps,
  inputLabelProps,
  onChange = () => {},
  inputProps,
  serverError,
  setSelectValue,
  setDisplayText,
  ...props
}) => {
  const { control } = useFormContext();

  const defaultFormControlProps = useMemo(
    () => ({
      sx: { width: "100%" },
    }),
    []
  );

  const mergedFormControlProps = useMemo(
    () => _.merge(defaultFormControlProps, formControlProps),
    [defaultFormControlProps, formControlProps]
  );

  const defaultinputLabelProps = useMemo(
    () => ({
      sx: { margin: 0, marginLeft: "-14px", marginTop: "4px" },
    }),
    []
  );

  const mergedinputLabelProps = useMemo(
    () => _.merge(defaultinputLabelProps, inputLabelProps),
    [defaultinputLabelProps, inputLabelProps]
  );

  return (
    <Controller
      {...{ control, name, defaultValue }}
      render={({ field: { name, onBlur, onChange: onChangeForm, ref: inputRef, value }, fieldState: { error } }) => (
        <FormControl error={!!error || !!serverError} {...mergedFormControlProps}>
          <InputLabel {...mergedinputLabelProps}>{label}</InputLabel>
          <Select
            {...{ name, onBlur, value, label, variant, inputRef, defaultValue }}
            {...(inputProps && { inputProps })}
            {...props}
            onChange={(e) => {
              onChange(e);
              onChangeForm(e.target.value);
            }}
          >
            {selectItems.map((item) => (
              <MenuItem value={JSON.stringify(setSelectValue(item))} key={item.id}>
                {setDisplayText(item)}
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
