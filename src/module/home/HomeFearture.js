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
import { LoadingSkeleton } from "../../components/loading";
import { db } from "../../firebase-app/firebase-config";
import PostFeatureItem from "../post/PostFeatureItem";

const HomeFeartureStyles = styled.div``;
const HomeFearture = () => {
  //Get data posts hot from firebase
  const [posts, setPosts] = useState([]);
  const isLoading = posts.length <= 0;
  console.log(isLoading);
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

  console.log(posts);
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

function HeadingSkeleton() {
  return (
    <div className="w-full h-[49px] rounded-md mb-5">
      <LoadingSkeleton
        width="200px"
        height="100%"
        radius="8px"
      ></LoadingSkeleton>
    </div>
  );
}
function PostItemSkeleton() {
  return (
    <div className="w-full h-[272px] rounded-md">
      <LoadingSkeleton
        width="100%"
        height="100%"
        radius="8px"
      ></LoadingSkeleton>
    </div>
  );
}
export default HomeFearture;
