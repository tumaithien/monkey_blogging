import React, { Fragment, useState } from "react";
import { IconEyeClose, IconEyeOpen } from "../icon";
import Input from "./Input";

const InputPasswordToggle = ({ control, name = "password" }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  if (!control) return null;
  return (
    <Fragment>
      <Input
        type={togglePassword ? "text" : "password"}
        name={name}
        control={control}
        placeholder="Enter your password"
      >
        {togglePassword ? (
          <IconEyeOpen onClick={() => setTogglePassword(false)}></IconEyeOpen>
        ) : (
          <IconEyeClose onClick={() => setTogglePassword(true)}></IconEyeClose>
        )}
      </Input>
    </Fragment>
  );
};

export default InputPasswordToggle;
