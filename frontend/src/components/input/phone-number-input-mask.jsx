import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

const PhoneNumberInputMask = forwardRef((props, ref) => {
  const { onChange, ..._props } = props;
  return (
    <IMaskInput
      {..._props}
      mask="#0 000 0000"
      definitions={{
        "#": /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default PhoneNumberInputMask;
