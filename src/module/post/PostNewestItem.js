import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";

const PostNewestItemStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid #eee;
  &:last-child {
    padding-bottom: 0;
    margin-bottom: 0;
    border-bottom: 0;
  }
  .post {
    &-image {
      display: block;
      flex-shrink: 0;
      width: 180px;
      height: 130px;
      border-radius: 12px;
    }
    &-content {
      flex: 1;
    }
    &-category {
      margin-bottom: 10px;
    }
    &-title {
      margin-bottom: 8px;
    }
    &-info {
      color: #6b6b6b;
    }
  }
  @media screen and (max-width: 1023.98px) {
    margin-bottom: 14px;
    padding-bottom: 14px;
    .post {
      &-image {
        width: 140px;
        height: 100px;
      }
    }
  }
`;
const PostNewestItem = ({ data }) => {
  if (!data) return null;
  const { category, createAt, image, title, slug, user } = data;
  const date = createAt?.seconds
    ? new Date(createAt?.seconds * 1000)
    : new Date();
  const formatDate = new Date(date).toLocaleDateString("vi-VI");
  return (
    <PostNewestItemStyles>
      <PostImage to={slug} alt={title} url={image}></PostImage>
      <div className="post-content">
        <PostCategory to={category?.slug} type="secondary">
          {category?.name}
        </PostCategory>
        <PostTitle to={slug} size="small">
          {title}
        </PostTitle>
        <PostMeta date={formatDate} authorName={user?.fullname}></PostMeta>
      </div>
    </PostNewestItemStyles>
  );
};

export default PostNewestItem;
