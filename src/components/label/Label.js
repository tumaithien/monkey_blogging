import React from "react";
import styled from "styled-components";

const LabelStyled = styled.label`
  color: ${(props) => props.theme.gray4b};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

const Label = ({ htmlFor = "", children, ...props }) => {
  return (
    <LabelStyled htmlFor={htmlFor} {...props}>
      {children}
    </LabelStyled>
  );
};

export default Label;
