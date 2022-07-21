import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import { db } from "../firebase-app/firebase-config";
import PostItem from "../module/post/PostItem";

const AuthorPage = () => {
  const params = useParams();
  console.log(params);
  const [postAuthor, setPostAuthor] = useState([]);
  useEffect(() => {
    async function fetchDataPost() {
      const colRef = collection(db, "posts");
      const queries = query(colRef, where("user.slug", "==", params.slug));
      onSnapshot(queries, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostAuthor(results);
      });
    }
    fetchDataPost();
  }, [params.slug]);
  console.log(postAuthor);
  if (postAuthor.length <= 0 || !postAuthor) return null;
  return (
    <Layout>
      <div className="container">
        <Heading>Author</Heading>
        <div className="grid-layout grid-layout--primary">
          {postAuthor.map((item) => (
            <PostItem key={item.id} data={item}></PostItem>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AuthorPage;
