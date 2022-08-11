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
import HeadingSkeleton from "../../components/skeleton/HeadingSkeleton";
import PostItemSkeleton from "../../components/skeleton/PostItemSkeleton";
import { db } from "../../firebase-app/firebase-config";
import PostFeatureItem from "../post/PostFeatureItem";

const HomeFeartureStyles = styled.div``;
const HomeFearture = () => {
  //Get data posts hot from firebase
  const [posts, setPosts] = useState([]);
  const isLoading = posts.length <= 0;
  useEffect(() => {
    const colRef = collection(db, "posts");
    const queries = query(
      colRef,
      where("status", "==", 1),
      where("hot", "==", true),
      limit(3)
    );
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
  // if (posts.length <= 0) return null;
  return (
    <HomeFeartureStyles className="home-block">
      <div className="container">
        {isLoading ? (
          <>
            <HeadingSkeleton></HeadingSkeleton>
            <div className="grid-layout">
              <PostItemSkeleton></PostItemSkeleton>
              <PostItemSkeleton></PostItemSkeleton>
              <PostItemSkeleton></PostItemSkeleton>
            </div>
          </>
        ) : (
          <>
            <Heading>Fearture Post</Heading>
            <div className="grid-layout">
              {posts.map((post) => (
                <PostFeatureItem key={post.id} data={post}></PostFeatureItem>
              ))}
            </div>
          </>
        )}
      </div>
    </HomeFeartureStyles>
  );
};
export default HomeFearture;
