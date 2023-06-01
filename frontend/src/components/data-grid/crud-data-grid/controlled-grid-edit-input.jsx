import { useGridRootProps, getDataGridUtilityClass } from "@mui/x-data-grid";
import { Box, Tooltip, unstable_composeClasses as composeClasses, Zoom } from "@mui/material";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material/utils";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useCallback, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import CellError from "@mui/icons-material/WarningAmber";

const useUtilityClasses = (ownerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ["editInputCell"],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridEditInputCellRoot = styled(InputBase, {
  name: "MuiDataGrid",
  slot: "EditInputCell",
  overridesResolver: (props, styles) => styles.editInputCell,
})(({ theme }) => ({
  ...theme.typography.body2,
  padding: "1px 0",
  "& input": {
    padding: "0 16px",
    height: "100%",
  },
}));

const ControlledGridEditInput = (props) => {
  const { id, api, field: name, colDef, hasFocus } = props;

  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const { control, setFocus } = useFormContext();
  const containerRef = useRef();

  const handleChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      api.setEditCellValue({ id, field: name, value: newValue, debounceMs: 800 }, event);
    },
    [api, name, id]
  );

  useEnhancedEffect(() => {
    if (hasFocus) {
      setFocus(name);
    }
  }, [hasFocus]);

  return (
    <Controller
      {...{ control, name, defaultValue: "" }}
      render={({ field: { name, onBlur, onChange, ref: inputRef, value }, fieldState: { error } }) => {
        return (
          <Box display="flex" position="relative" flexGrow={1} ref={containerRef}>
            <Tooltip
              title={error?.message}
              open={!!error}
              placement="bottom"
              TransitionComponent={Zoom}
              componentsProps={{
                tooltip: {
                  sx: {
                    maxWidth: "initial",
                    bgcolor: "error.main",
                    width: () => {
                      return `${containerRef.current.offsetWidth}px`;
                    },
                    paddingLeft: "16px",
                  },
                },
              }}
            >
              <Box flexGrow={1}>
                <GridEditInputCellRoot
                  className={classes.root}
                  type={colDef.type === "number" ? colDef.type : "text"}
                  onChange={(event) => {
                    onChange(event);
                    handleChange(event);
                  }}
                  {...{ name, value, onBlur, id, inputRef, fullWidth: true }}
                />
              </Box>
            </Tooltip>
            {!!error && <CellError sx={{ position: "absolute", color: "red", right: 10 }} />}
          </Box>
        );
      }}
    />
  );
};

export default ControlledGridEditInput;
