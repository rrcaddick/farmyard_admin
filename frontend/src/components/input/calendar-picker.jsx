import { Controller, useFormContext } from "react-hook-form";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

/**
 * @param {String} name - Name of the form input
 * @param {Number} defaultValue - Unix time stamp for default selected date
 */
const CalendarPicker = ({ name, defaultValue = dayjs().unix(), validate }) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...{ control, name, defaultValue }}
      render={({ field: { name, onBlur, onChange, ref: inputRef, value }, fieldState: { error }, formState }) => (
        <DateCalendar
          disablePast={true}
          onChange={async (date) => {
            onChange(date.unix());
            await validate();
          }}
          value={dayjs.unix(value)}
          {...{ name, onBlur, ref: inputRef }}
        />
      )}
    />
  );
};

export default CalendarPicker;
