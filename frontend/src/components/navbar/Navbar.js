import React from "react";

const Navbar = ({
  onLogin,
  onSignup,
  onNotifications,
  onLogout,
  isUserLoggedIn,
  onFollowersModal,
}) => {
  return (
    <div className="navbar">
      <button className="navbar-button" onClick={onLogin}>
        Log In
      </button>
      <button className="navbar-button" onClick={onSignup}>
        Sign Up
      </button>
      {isUserLoggedIn ? (
        <>
          <button
            className="navbar-button"
            id="notification-button"
            onClick={onNotifications}
          >
            Notification
          </button>
          <button className="navbar-button" onClick={onFollowersModal}>
            Followers
          </button>
          <button className="navbar-button" onClick={onLogout}>
            Logout
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Navbar;
