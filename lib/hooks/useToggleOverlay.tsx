"use client";
import { useReducer, useEffect, useRef } from "react";

const reducer = (
  state: { isOpened: boolean },
  action: { type: "toggle" | "close" }
) => {
  switch (action.type) {
    case "toggle":
      return { isOpened: !state.isOpened };
    case "close":
      return { isOpened: false };
    default:
      throw new Error();
  }
};

const useToggleOverlay = () => {
  const [state, dispatch] = useReducer(reducer, { isOpened: false });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: "close" });
      }
    };

    if (state.isOpened) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [state.isOpened]);

  function handleToggle(): void {
    dispatch({ type: "toggle" });
  }

  return { isOpened: state.isOpened, handleToggle, overlayRef };
};

export default useToggleOverlay;
