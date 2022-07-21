import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const FieldStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 10px;
  margin-bottom: 25px;
  &:last-child {
    margin-bottom: 0;
  }
  @media screen and (max-width: 1023.98px) {
    margin-bottom: 20px;
  }
`;
const Field = ({ children }) => {
  return <FieldStyles>{children}</FieldStyles>;
};

Field.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Field;
