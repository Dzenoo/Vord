import { VALIDATOR_REQUIRE, validate } from "@/lib/validators/Validators";
import { useCallback, useEffect, useMemo, useReducer } from "react";

export interface SelectPropsTypes {
  options: {
    id: string;
    value: string;
    label: string;
  }[];
  id: string;
  onInputChange: any;
  label?: string;
}

export interface SelectReducerActionTypes {
  type: "SELECT_CHANGE";
  value: string;
}

export interface SelectReducerStateTypes {
  value: string;
  isValid: boolean;
}

const reducer = (
  state: SelectReducerStateTypes,
  action: SelectReducerActionTypes
): SelectReducerStateTypes => {
  switch (action.type) {
    case "SELECT_CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, [VALIDATOR_REQUIRE()]),
      };
    default:
      return state;
  }
};

const Select: React.FC<SelectPropsTypes> = ({
  options,
  id,
  onInputChange,
  label,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    useMemo(
      () => ({
        value: "",
        isValid: false,
      }),
      []
    )
  );

  useEffect(() => {
    onInputChange(id, state.value, state.isValid);
  }, [state.value, state.isValid, onInputChange, id]);

  const selectChangeHandler = useCallback((event: any) => {
    dispatch({ type: "SELECT_CHANGE", value: event.target.value });
  }, []);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-3 text-xs font-bold uppercase text-gray-300"
      >
        {label}
      </label>
      <select
        id={id}
        onChange={selectChangeHandler}
        className="p-3 rounded-md w-full mt-3 bg-[#2b2b2b] text-white transition-opacity border border-gray-400"
      >
        {options.map((option: { id: string; value: string; label: string }) => (
          <option key={option.id} value={option.value} className="">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
