import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";
import PropTypes from "prop-types";
const InputStyled = styled.div`
  position: relative;
  width: 100%;
  input {
    width: 100%;
    border-radius: 8px;
    padding: ${(props) =>
      props.hasIcon ? "15px 60px 15px 25px" : "15px 25px"};
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.grayf1};
    font-weight: 500;
    transition: all 0.2s linear;
    color: ${(props) => props.theme.black};
    font-size: 14px;
  }
  input:focus {
    border: 1px solid ${(props) => props.theme.primary};
  }
  input::-webkit-input-placeholder {
    color: #84878b;
  }
  input::-moz-input-placeholder {
    color: #84878b;
  }
  .input-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translate(0, -50%);
    cursor: pointer;
  }
`;

/**
 *
 * @param {*} placeholder(optional) - Placeholder of input
 * @param {*} name(optional) - name of input
 * @param {*} control - control from react hook form
 * @returns Input
 */
const Input = ({ name = "", type = "text", children, control, ...props }) => {
  const { field } = useController({
    name,
    defaultValue: "",
    control,
  });
  //   console.log(hasIcon);
  return (
    <InputStyled hasIcon={children ? true : false}>
      <input type={type} id={name} {...field} {...props} />
      {children ? <div className="input-icon">{children}</div> : null}
    </InputStyled>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  children: PropTypes.any,
  control: PropTypes.any.isRequired,
};

export default Input;
