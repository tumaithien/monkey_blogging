import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
const PostCategoryStyles = styled.div`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 10px;
  color: #6b6b6b;
  font-size: 14px;
  font-weight: 600;
  background-color: #f3f3f3;
  white-space: nowrap;
  transition: all 0.2s linear;
  ${(props) =>
    props.type === "primary" &&
    css`
      background-color: #f3edff;
    `};
  ${(props) =>
    props.type === "secondary" &&
    css`
      background-color: #fff;
    `};
  &:hover {
    background-color: ${(props) => props.theme.accent};
    color: #fff;
  }
  @media screen and (max-width: 1023.98px) {
    font-size: 10px;
  }
`;
const PostCategory = ({
  children,
  type = "primary",
  className = "",
  to = "",
  ...props
}) => {
  return (
    <PostCategoryStyles
      type={type}
      className={`post-category ${className}`}
      {...props}
    >
      <Link to={`/category/${to}`}>{children}</Link>
    </PostCategoryStyles>
  );
};

export default PostCategory;
