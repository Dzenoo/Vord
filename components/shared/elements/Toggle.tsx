"use client";

import { useState } from "react";

interface ToggleProps {
  content: React.ReactNode;
  title: string;
}

const Toggle: React.FC<ToggleProps> = ({ content, title }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = (): void => setOpen((prevOpen) => !prevOpen);

  return (
    <div className="relative">
      <h6 className="mb-0">
        <button
          className="relative flex w-full transition-all ease-in cursor-pointer text-white group"
          onClick={handleOpen}
        >
          <span>{title}</span>
          <i className="absolute right-0 pt-1 text-base transition-transform fa fa-chevron-down group-open:rotate-180"></i>
        </button>
      </h6>
      <div
        className={`h-0 overflow-hidden transition-all duration-300 ease-in-out animate_opacity ${
          open ? "h-auto" : ""
        }`}
      >
        <div className="pt-3">{content}</div>
      </div>
    </div>
  );
};

export default Toggle;
