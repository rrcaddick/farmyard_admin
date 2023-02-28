import { FormControl, FormControlLabel, FormHelperText, Checkbox as MuiCheckbox } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const Checkbox = ({ name, label, onChange }) => {
  const { control } = useFormContext();

  return (
    <Controller
      defaultValue={false}
      {...{ control, name }}
      render={({ field: { name, onBlur, onChange: formOnChange, ref, value: checked }, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormControlLabel
            inputRef={ref}
            {...{ label }}
            control={
              <MuiCheckbox
                {...{ name, checked, onBlur }}
                onChange={(value) => {
                  onChange(value);
                  formOnChange(value);
                }}
              />
            }
          />
          {!!error && <FormHelperText sx={{ margin: 0 }}>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default Checkbox;
