import React from "react";
import styled from "styled-components";
import Layout from "../components/layout/Layout";
import HomeBanner from "../module/home/HomeBanner";
import HomeFearture from "../module/home/HomeFearture";
import HomeNewest from "../module/home/HomeNewest";

const HomePageStyles = styled.div``;
const HomePage = () => {
  return (
    <HomePageStyles>
      <Layout>
        <HomeBanner></HomeBanner>
        <HomeFearture></HomeFearture>
        <HomeNewest></HomeNewest>
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
