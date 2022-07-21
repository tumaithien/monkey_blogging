import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
const PostTitleStyles = styled.h3`
  display: block;
  font-weight: 600;
  line-height: 1.5;
  a {
    display: block;
  }
  color: ${(props) => props.color};
  ${(props) =>
    props.size === "normal" &&
    css`
      font-size: 18px;
      @media screen and (max-width: 1023.98px) {
        font-size: 14px;
      }
    `};
  ${(props) =>
    props.size === "big" &&
    css`
      font-size: 22px;
      @media screen and (max-width: 1023.98px) {
        font-size: 16px;
      }
    `};
  ${(props) =>
    props.size === "small" &&
    css`
      font-size: 16px;
    `};
`;
const PostTitle = ({
  children,
  className = "",
  size = "normal",
  to = "",
  ...props
}) => {
  return (
    <PostTitleStyles
      size={size}
      className={`post-title ${className}`}
      {...props}
    >
      <Link to={`/${to}`}>{children}</Link>
    </PostTitleStyles>
  );
};

export default PostTitle;
