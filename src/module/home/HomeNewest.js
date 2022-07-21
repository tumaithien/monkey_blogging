import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import { db } from "../../firebase-app/firebase-config";
import PostItem from "../post/PostItem";
import PostNewestItem from "../post/PostNewestItem";
import PostNewestLarge from "../post/PostNewestLarge";
import { v4 } from "uuid";

const HomeNewestStyles = styled.div`
  .layout {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px;
    margin-bottom: 65px;
    align-items: flex-start;
  }
  .sidebar {
    padding: 28px 20px;
    background-color: #f3edff;
    border-radius: 16px;
  }
  @media screen and (max-width: 1023.98px) {
    .layout {
      grid-template-columns: 100%;
    }
    .sidebar {
      padding: 14px 10px;
    }
  }
`;
const HomeNewest = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(colRef, where("status", "==", 1), limit(4));
    onSnapshot(queries, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(results);
    });
  }, []);
  const dataPost = posts.sort(function (a, b) {
    return b.createAt.seconds - a.createAt.seconds;
  });
  if (dataPost.length <= 0) return null;
  const [first, ...other] = dataPost;
  return (
    <HomeNewestStyles className="home-block">
      <div className="container">
        <Heading>Newest article</Heading>
        <div className="layout">
          <PostNewestLarge data={first}></PostNewestLarge>
          <div className="sidebar">
            {other.length > 0 &&
              other.map((item) => (
                <PostNewestItem key={v4()} data={item}></PostNewestItem>
              ))}
          </div>
        </div>
        <div className="grid-layout grid-layout--primary">
          {dataPost.length > 0 &&
            dataPost.map((item) => (
              <PostItem key={v4()} data={item}></PostItem>
            ))}
        </div>
      </div>
    </HomeNewestStyles>
  );
};

export default HomeNewest;
