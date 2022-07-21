import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const AuthenticationPageStyles = styled.div`
  min-height: 100vh;
  padding: 40px;
  .logo {
    margin: 0 auto 20px;
  }
  .heading {
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-weight: 600;
    font-size: 40px;
    margin-bottom: 60px;
  }
  .form {
    max-width: 600px;
    margin: 0 auto;
  }
  .have-account {
    margin-bottom: 20px;
    a {
      display: inline-block;
      color: ${(props) => props.theme.primary};
      font-weight: 500;
      text-decoration: none;
    }
  }
`;
const AuthenticationPage = ({ children }) => {
  return (
    <AuthenticationPageStyles>
      <div className="container">
        <NavLink to="/">
          <img
            className="logo"
            srcSet="/images/logo-monkey.png"
            alt="monkey-blogging"
          />
        </NavLink>
        <h1 className="heading">Monkey Blogging</h1>
      </div>
      {children}
    </AuthenticationPageStyles>
  );
};

export default AuthenticationPage;
