import { collection, onSnapshot, query, where } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Heading from "../components/layout/Heading";
import Layout from "../components/layout/Layout";
import { db } from "../firebase-app/firebase-config";
import PostItem from "../module/post/PostItem";

const CategoryPage = () => {
  const params = useParams();
  const [postCategory, setPostCategory] = useState([]);
  useEffect(() => {
    async function fetchDataPost() {
      const colRef = collection(db, "posts");
      const queries = query(colRef, where("category.slug", "==", params.slug));
      onSnapshot(queries, (snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setPostCategory(results);
      });
    }
    fetchDataPost();
  }, [params.slug]);
  if (postCategory.length <= 0) return null;
  console.log(postCategory);
  return (
    <Layout>
      <div className="container">
        <Heading>Category {params.slug}</Heading>
        <div className="grid-layout grid-layout--primary">
          {postCategory.map((item) => (
            <PostItem key={item.id} data={item}></PostItem>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
