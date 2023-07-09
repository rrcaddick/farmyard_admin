import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import parsePhoneNumber from "libphonenumber-js/max";

const PhoneNumberInputMask = forwardRef((props, ref) => {
  const { onChange, ..._props } = props;
  return (
    <IMaskInput
      {..._props}
      mask={[
        {
          mask: "+00 00 000 0000",
          definitions: {
            "+": /[+]/,
          },
        },
        {
          mask: "00 00 000 0000",
        },
        {
          mask: "000 000 0000",
        },
        {
          mask: "(000) 000-0000",
        },
      ]}
      onAccept={(value, ref, event) => {
        !!event && onChange({ target: { name: props.name, value } });
      }}
      unmask="typed"
      dispatch={(appended, dynamicMasked) => {
        const value = `${dynamicMasked.typedValue}${appended}`;

        if (["+", "+2", "+27"].includes(value.slice(0, 3))) {
          return dynamicMasked.compiledMasks[0];
        }

        if (["2", "27"].includes(value.slice(0, 2))) {
          return dynamicMasked.compiledMasks[1];
        }

        if (value[0] === "0") {
          const phoneNumber = parsePhoneNumber(value, "ZA");
          if (phoneNumber?.getType() === "FIXED_LINE") {
            return dynamicMasked.compiledMasks[3];
          }
        }

        return dynamicMasked.compiledMasks[2];
      }}
      inputRef={ref}
    />
  );
});

export default PhoneNumberInputMask;
