import React from "react";
import { DropdownProvider } from "./dropdown-context";

const Dropdown = ({ children, ...props }) => {
  return (
    <DropdownProvider {...props}>
      <div className="relative w-full inline-block">{children}</div>
    </DropdownProvider>
  );
};

export default Dropdown;
