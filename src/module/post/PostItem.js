import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostItemStyles = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  .post {
    &-image {
      height: 202px;
      width: 100%;
      display: block;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    &-category {
      margin-bottom: 16px;
    }
    &-title {
      margin-bottom: 12px;
    }
    &-info {
      color: ${(props) => props.theme.textGray};
    }
  }
  @media screen and (max-width: 1023.98px) {
    .post {
      &-image {
        aspect-ratio: 16/9;
        height: auto;
      }
    }
  }
`;
const PostItem = ({ data }) => {
  if (!data) return null;
  const { category, title, image, slug, user, createAt } = data;
  const date = createAt?.seconds
    ? new Date(createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostItemStyles>
      <PostImage to={slug} alt={title} url={image}></PostImage>
      <PostCategory to={category?.slug}>{category?.name}</PostCategory>
      <PostTitle size="small" to={slug}>
        {title}
      </PostTitle>
      <PostMeta
        date={formatDate}
        authorName={user?.fullname}
        to={user?.username}
      ></PostMeta>
    </PostItemStyles>
  );
};

export default PostItem;
