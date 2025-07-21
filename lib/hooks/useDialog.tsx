"use client";

import { useReducer } from "react";

const dialogReducer = (
  state: {
    dialogs: {
      [key: string]: { isOpen: boolean };
    };
  },
  action: { type: "OPEN" | "CLOSE"; dialogId?: any }
) => {
  switch (action.type) {
    case "OPEN": {
      if (state.dialogs[action.dialogId]) {
        return {
          ...state,
          dialogs: {
            ...state.dialogs,
            [action.dialogId]: { isOpen: true },
          },
        };
      }
      return state;
    }
    case "CLOSE": {
      if (state.dialogs[action.dialogId]) {
        return {
          ...state,
          dialogs: {
            ...state.dialogs,
            [action.dialogId]: { isOpen: false },
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
};

const useDialog = (dialogs: { [key: string]: { isOpen: boolean } }) => {
  const [state, dispatch] = useReducer(dialogReducer, {
    dialogs: dialogs,
  });

  function openDialog(dialogId: string): void {
    dispatch({ type: "OPEN", dialogId: dialogId });
  }

  function closeDialog(dialogId: string): void {
    dispatch({ type: "CLOSE", dialogId: dialogId });
  }

  return { dialogs: state.dialogs, openDialog, closeDialog };
};

export default useDialog;
