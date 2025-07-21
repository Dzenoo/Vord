import { useCallback, useReducer } from "react";
import { InitialInputsTypes, ValidatorState } from "../validators/Validators";

const reducer = (
  state: ValidatorState,
  action:
    | { type: "CHANGE"; inputId: string; value: string; isValid: boolean }
    | {
        type: "RESTART";
        inputs: { [key: string]: InitialInputsTypes };
        formIsValid: boolean;
      }
) => {
  switch (action.type) {
    case "CHANGE": {
      let formIsValid: boolean = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    }
    case "RESTART": {
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    }
    default:
      return state;
  }
};

const useForm = (
  initialInputs: { [key: string]: InitialInputsTypes },
  initialValidity: boolean
) => {
  const [formState, dispatch] = useReducer(reducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  } as ValidatorState);

  const inputChangeHandler = useCallback(
    (id: string, value: string, isValid: boolean): void => {
      dispatch({ type: "CHANGE", value, isValid, inputId: id });
    },
    []
  );

  const restartForm = useCallback(
    (
      inputData: { [key: string]: InitialInputsTypes },
      formValidity: boolean,
      formId?: string
    ) => {
      dispatch({
        type: "RESTART",
        inputs: inputData,
        formIsValid: formValidity,
      });
      if (formId) {
        const form = document.getElementById(formId)! as HTMLFormElement;
        form.reset();
      }
    },
    []
  );

  return { formState, inputChangeHandler, restartForm };
};

export default useForm;
