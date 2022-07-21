import React from "react";
import styled, { css } from "styled-components";
import { LoadingSpinner } from "../loading";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const ButtonStyles = styled.button`
  cursor: pointer;
  padding: 0 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-out;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: 0px;
  height: ${(props) => props.height || "66px"};
  ${(props) =>
    props.kind === "secondary" &&
    css`
      color: ${(props) => props.theme.primary};
      background-color: white;
    `};
  ${(props) =>
    props.kind === "primary" &&
    css`
      background-color: ${(props) => props.theme.primary};
      color: #fff;
    `};
  ${(props) =>
    props.kind === "ghost" &&
    css`
      color: ${(props) => props.theme.primary};
      background-color: rgba(29, 192, 113, 0.1);
    `};

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

/**
 * @param {*} onClick handler onClick
 * @required
 * @param {string} type Type of button
 */

const Button = ({
  type = "button",
  onClick = () => {},
  children,
  kind = "primary",
  ...props
}) => {
  const { isLoading, to } = props;
  const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children; //convert isLoading sang boolean
  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to} style={{ display: "inline-block" }}>
        <ButtonStyles kind={kind} type={type} {...props}>
          {child}
        </ButtonStyles>
      </NavLink>
    );
  }
  return (
    <ButtonStyles kind={kind} type={type} onClick={onClick} {...props}>
      {child}
    </ButtonStyles>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  kind: PropTypes.oneOf(["primary", "secondary", "ghost"]),
};

export default Button;
