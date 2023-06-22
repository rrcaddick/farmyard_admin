import { Box } from "@mui/material";
import Header from "@components/display/header";
import { useCallback, useState } from "react";

let test;

const useNestedHook = () => {
  const [state, setState] = useState(false);

  const toggleState = useCallback(() => {
    setState((state) => !state);
  }, []);

  test = toggleState;

  return {
    nestedState: state,
    toggleNestedState: toggleState,
  };
};

const useTest = () => {
  const [state, setState] = useState(false);

  const { nestedState } = useNestedHook();

  const toggleState = useCallback(() => {
    setState((state) => !state);
  }, []);

  return {
    state,
    nestedState,
    toggleState,
  };
};

const Projects = () => {
  const [componentState, setComponentState] = useState(false);
  const { state, toggleState, nestedState } = useTest();

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" gap="1rem" overflow="hidden">
      <Header title="Projects" subtitle="Never let a project fail again" />
      <p>Component State: {componentState.toString()}</p>
      <p>Parent Hook State: {state.toString()}</p>
      <p>Nested Hook State: {nestedState.toString()}</p>

      <button
        onClick={() => {
          setComponentState(true);
        }}
      >
        Change Component State
      </button>
      <button onClick={toggleState}>Change Parent Hook State</button>
      <button onClick={test}>Change Nested Hook State</button>
    </Box>
  );
};

export default Projects;
