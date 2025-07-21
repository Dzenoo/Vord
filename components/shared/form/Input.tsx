"use client";

import {
  ValidatorPropertiesTypes,
  validate,
} from "@/lib/validators/Validators";
import { useCallback, useEffect, useReducer } from "react";

export enum InputElement {
  INPUT = "input",
  TEXTAREA = "textarea",
}

export interface InputProps {
  elementType: InputElement;
  id: string;
  type: "text" | "password" | "email" | "date" | "time" | "number";
  placeholder: string;
  value?: string;
  label?: string;
  helperText?: string;
  validators: ValidatorPropertiesTypes[];
  onInputChange: any;
  initialValidity?: boolean;
}

export interface InputReducerActionTypes {
  type: "CHANGE" | "BLUR";
  payload: {
    value: string;
    validators: ValidatorPropertiesTypes[];
  };
}

export interface InputReducerStateTypes {
  value: string;
  isTouched: boolean;
  isValid: boolean;
}

const reducer = (
  state: InputReducerStateTypes,
  action: InputReducerActionTypes
) => {
  switch (action.type) {
    case "CHANGE": {
      const { value, validators } = action.payload;

      return {
        ...state,
        value: value,
        isValid: validate(value, validators),
      };
    }
    case "BLUR": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default: {
      return state;
    }
  }
};

const Input: React.FC<InputProps> = ({
  id,
  value,
  type,
  placeholder,
  label,
  helperText,
  elementType,
  validators,
  onInputChange,
  initialValidity,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    value: value || "",
    isTouched: false,
    isValid: initialValidity || false,
  });

  useEffect(() => {
    onInputChange(id, state.value, state.isValid);
  }, [state.value, state.isValid, onInputChange, id]);

  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      dispatch({
        type: "CHANGE",
        payload: { value: e.target.value, validators: validators },
      });
    },
    []
  );

  const blurHandler = useCallback(() => {
    dispatch({ type: "BLUR", payload: { value: "", validators: [] } });
  }, []);

  let element:
    | React.ReactElement<HTMLInputElement>
    | React.ReactElement<HTMLTextAreaElement>;

  if (elementType === "textarea") {
    element = (
      <textarea
        id={id}
        value={state.value}
        placeholder={placeholder}
        className={`p-3 rounded-md bg-[#2b2b2b] text-white resize-y h-36 ${
          !state.isValid && state.isTouched && "border border-red-600"
        }`}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
    );
  } else {
    element = (
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        defaultValue={value}
        className={`p-3 rounded-md bg-[#2b2b2b] text-white  ${
          !state.isValid && state.isTouched && "border border-red-600"
        }`}
        onChange={changeHandler}
        onBlur={blurHandler}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={id}
        className={`text-xs font-bold uppercase ${
          !state.isValid && state.isTouched ? "text-red-600" : "text-gray-300"
        }`}
      >
        {label}
      </label>
      {element}
      {!state.isValid && state.isTouched && (
        <p className="text-xs text-red-600">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
