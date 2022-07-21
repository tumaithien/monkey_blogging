import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostNewestLargeStyles = styled.div`
  .post {
    &-image {
      display: block;
      margin-bottom: 16px;
      height: 433px;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 10px;
    }
    @media screen and (max-width: 1023.98px) {
      &-image {
        height: 250px;
      }
    }
  }
`;
const PostNewestLarge = ({ data }) => {
  if (!data) return null;
  const { category, createAt, image, title, slug, user } = data;
  const date = createAt?.seconds
    ? new Date(createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostNewestLargeStyles>
      <PostImage url={image} alt={title}></PostImage>
      <PostCategory to={category?.slug}>{category?.name}</PostCategory>
      <PostTitle to={slug} size="big">
        {title}
      </PostTitle>
      <PostMeta date={formatDate} authorName={user?.fullname}></PostMeta>
    </PostNewestLargeStyles>
  );
};

export default PostNewestLarge;
