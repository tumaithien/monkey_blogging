import React from "react";
import styled from "styled-components";

const HeadingStyles = styled.h2`
  color: ${(props) => props.theme.teriary};
  font-size: 28px;
  line-height: 1.75;
  position: relative;
  margin-bottom: 30px;
  font-weight: 600;
  @media screen and (max-width: 1023.98px) {
    font-size: 22px;
    margin-bottom: 20px;
  }
`;
const Heading = ({ children, className = "" }) => {
  return <HeadingStyles className={className}>{children}</HeadingStyles>;
};

export default Heading;
