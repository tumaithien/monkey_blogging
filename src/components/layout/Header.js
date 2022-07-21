import React from "react";
import styled from "styled-components";
import Button from "../button/Button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
const HeaderStyles = styled.header`
  padding: 20px 0;
  .header-main {
    display: flex;
    align-items: center;
  }
  .logo {
    display: flex;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 40px;
    list-style: none;
    font-weight: 600;
  }
  .search {
    margin-left: auto;
    padding: 15px 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
    max-width: 320px;
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
  .search-input {
    border: none;
    flex: 1;
    padding-right: 30px;
    font-weight: 500;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
    cursor: pointer;
  }
  .header-auth {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  @media screen and (max-width: 1023.98px) {
    .logo {
      max-width: 30px;
    }
    .menu,
    .search,
    .header-button,
    .header-auth {
      display: none;
    }
  }
`;
const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/blog",
    title: "Blog",
  },
  {
    url: "/contact",
    title: "Contact",
  },
];
const Header = () => {
  const { userInfo } = useAuth();
  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img
              srcSet="/images/logo-monkey.png 2x"
              className="logo"
              alt="monkey-blogging"
            />
          </NavLink>
          <ul className="menu">
            {menuLinks.length > 0 &&
              menuLinks.map((item) => (
                <li className="menu-item" key={item.title}>
                  <NavLink to={item.url} className="menu-link">
                    {item.title}
                  </NavLink>
                </li>
              ))}
          </ul>
          <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search posts..."
            />
            <span className="search-icon">
              <svg
                width={18}
                height={17}
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="7.66669"
                  cy="7.05161"
                  rx="6.66669"
                  ry="6.05161"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
                <path
                  d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
          {!userInfo ? (
            <Button
              style={{ maxWidth: "200px" }}
              height="56px"
              className="header-button"
              type="button"
              to="/sign-in"
            >
              Sign In
            </Button>
          ) : (
            <div className="header-auth">
              <h3>Welcome back, {userInfo.username || "User"}</h3>
              <Button
                type="button"
                className="header-button"
                height="56px"
                to="/dashboard"
              >
                Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
