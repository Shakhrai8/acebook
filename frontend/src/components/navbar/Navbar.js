import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({
  onLogin,
  onSignup,
  onNotifications,
  onLogout,
  isUserLoggedIn,
  onFollowersModal,
}) => {
  return (
    <ul className="menu">
      {!isUserLoggedIn ? (
        <>
          <li className="menu_list" onClick={onLogin}>
            <span className="front">
              <i className="fas fa-sign-in-alt"></i>
            </span>
            <Link to="/" className="side">
              Login
            </Link>
          </li>
          <li className="menu_list" onClick={onSignup}>
            <span className="front">
              <i className="fas fa-user-plus"></i>
            </span>
            <Link to="/" className="side">
              Sign Up
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className="menu_list" onClick={onNotifications}>
            <span className="front">
              <i className="fas fa-bell"></i>
            </span>
            <Link to="/" className="side">
              Notifications
            </Link>
          </li>
          <li className="menu_list" onClick={onFollowersModal}>
            <span className="front">
              <i className="fas fa-users"></i>
            </span>
            <Link to="/" className="side">
              Followers
            </Link>
          </li>
          <li className="menu_list">
            <span className="front">
              <i className="fas fa-users-cog"></i>
            </span>
            <Link to="/groups" className="side">
              Groups
            </Link>
          </li>
          <li className="menu_list" onClick={onLogout}>
            <span className="front">
              <i className="fas fa-sign-out-alt"></i>
            </span>
            <Link to="/" className="side">
              Logout
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

export default Navbar;
