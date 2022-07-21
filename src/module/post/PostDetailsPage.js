import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import parse from "html-react-parser";
import Layout from "../../components/layout/Layout";
import { db } from "../../firebase-app/firebase-config";
import PageNotFound from "../../pages/PageNotFound";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import AuthorBox from "../../components/author/AuthorBox";
import PostRelated from "./PostRelated";

const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-fearture {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;
const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = useState({});
  useEffect(() => {
    async function fetchDataContent() {
      if (!slug) return;
      const colRef = query(collection(db, "posts"), where("slug", "==", slug));
      onSnapshot(colRef, (snapshot) => {
        snapshot.forEach((doc) => {
          doc.data() &&
            setPostInfo({
              id: doc.id,
              ...doc.data(),
            });
        });
      });
    }
    fetchDataContent();
  }, [slug]);
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug]);
  const { title, user, category, createAt, image } = postInfo;
  console.log(postInfo);
  const postContent = parse(postInfo?.content || "");
  if (!postInfo.slug) {
    return null;
  } else if (slug !== postInfo.slug) {
    return <PageNotFound></PageNotFound>;
  }
  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={image}
              alt={title}
              title={title}
              className="post-fearture"
            ></PostImage>
            <div className="post-info">
              <PostCategory className="mb-6" to={`${category.slug}`}>
                {category.name}
              </PostCategory>
              <h1 className="post-heading">{title}</h1>
              <PostMeta
                to={user?.username}
                date={new Date(createAt * 1000).toLocaleDateString("vi")}
                authorName={user.fullname || ""}
              ></PostMeta>
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">{postContent}</div>
            <AuthorBox userId={user.id}></AuthorBox>
          </div>
          <PostRelated categoryId={postInfo?.categoryId}></PostRelated>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
