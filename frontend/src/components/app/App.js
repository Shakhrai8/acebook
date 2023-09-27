import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import LogoutForm from "../auth/LogoutForm";
import SignUpForm from "../user/SignUpForm";
import Feed from "../feed/Feed";
import Navbar from "../navbar/Navbar";
import SearchBar from "../searchbar/SearchBar";
import NotificationModal from "../notification/NotificationButton";
import TopGroups from "../group/TopGroups";
import { isTokenExpired } from "../common/TokenExpirationChecker";

import OtherUserProfilePage from "../profile/OtherUserProfilePage";
import FollowerModal from "../followers/FollowerModal";
import GroupPage from "../group/GroupPage";
import GroupDetailsPage from "../group/GroupDetailsPage";
import TrendingPosts from "../post/TrendingPost";
import UsersToFollow from "../followers/UsersToFollow";
import AnimationComponent from "../common/AnimationComponent";
import Profile from "../profile/ProfilePage";

import jwt_decode from "jwt-decode";

import "./App.css";

const App = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showLogoutForm, setShowLogoutForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  const navigate = useNavigate();

  const handleLogin = () => setShowLoginForm(true); // Renamed to handleLogin
  const handleSignup = () => setShowSignUpForm(true); // Renamed to handleSignup
  const handleNotifications = () => setShowNotificationModal(true);
  const handleLogout = () => setShowLogoutForm(true);
  const handleFollowersModal = () => setShowFollowersModal(true);

  const token = window.localStorage.getItem("token");

  const handleSuccessfulLogin = () => {
    setIsUserLoggedIn(true);
    // ...other stuff, like closing the modal
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") {
      navigate("/logout"); 
      return; 
    }

    const decodedToken = jwt_decode(token);

    if (!decodedToken || !decodedToken.user_id) {
      navigate("/login"); 
      return; 
    }

    setUserId(decodedToken.user_id);
    setIsUserLoggedIn(true);

    const userIdFromStorage = window.localStorage.getItem("userId");
    if (
      userIdFromStorage &&
      userIdFromStorage !== "null" &&
      userIdFromStorage !== "undefined"
    ) {
      setUserId(userIdFromStorage); 
    }
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <Link className="header-link" to="/">
          <h1 className="header-title">ACEBOOK</h1>
        </Link>
      </div>

      <div className="main-content">
        <div className="navbar-container">
          <Navbar
            onLogin={handleLogin}
            onSignup={handleSignup}
            onNotifications={handleNotifications}
            onLogout={handleLogout}
            isUserLoggedIn={isUserLoggedIn}
            onFollowersModal={handleFollowersModal}
          />
          <AnimationComponent />
        </div>

        <div className="content">
          <div className="top-bar">
            <div className="top-right">
              <Link to="/" className="feed-button-link">
                <button className="feed-button">Back to Feed</button>
              </Link>
              <Link to={`/profiles/${userId}`} className="profile-button-link">
                <button className="profile-button">Profile</button>
              </Link>
            </div>
          </div>

          <div className="feed-container">
            {isUserLoggedIn ? (
              <SearchBar setSearchTerm={setSearchTerm} />
            ) : null}
            <Routes>
              <Route
                path="*"
                element={
                  isUserLoggedIn ? (
                    <Feed
                      navigate={navigate}
                      searchTerm={searchTerm}
                      isUserLoggedIn={isUserLoggedIn}
                    />
                  ) : (
                    <div id="login-placeholder">
                      Please log in to see the feed.
                    </div>
                  )
                }
              />
              <Route
                path="/profiles/:id/*"
                element={
                  isUserLoggedIn ? (
                    <Profile userId={userId} />
                  ) : (
                    <div id="login-placeholder">
                      Please log in to see the profile.
                    </div>
                  )
                }
              />
              <Route
                path="/users/:id/*"
                element={
                  isUserLoggedIn ? (
                    <OtherUserProfilePage />
                  ) : (
                    <div id="login-placeholder">
                      Please log in to view other profiles.
                    </div>
                  )
                }
              />
              <Route
                path="/groups/*"
                element={
                  isUserLoggedIn ? (
                    <GroupPage />
                  ) : (
                    <div>Please log in to see the groups.</div>
                  )
                }
              />
              <Route
                path="/groups/:id/*"
                element={
                  isUserLoggedIn ? (
                    <GroupDetailsPage searchTerm={searchTerm} />
                  ) : (
                    <div>Please log in to see the group details.</div>
                  )
                }
              />
            </Routes>
          </div>
        </div>
        <div className="dashboard-container">
          {isUserLoggedIn && (
            <>
              <div className="trending-container">
                <TrendingPosts token={token} />
              </div>
              <div className="users-to-follow-container">
                <UsersToFollow token={token} currentUserId={userId} />
              </div>
              <div className="top-groups-container">
                <TopGroups />
              </div>
            </>
          )}
        </div>
      </div>

      {showLoginForm && (
        <LoginForm
          navigate={navigate}
          onClose={() => setShowLoginForm(false)}
          handleSuccessfulLogin={handleSuccessfulLogin}
          setUserId={setUserId}
        />
      )}

      {showLogoutForm && (
        <LogoutForm
          navigate={navigate}
          onClose={() => setShowLogoutForm(false)}
          setIsUserLoggedIn={setIsUserLoggedIn}
          setUserId={setUserId}
        />
      )}

      {showSignUpForm && (
        <SignUpForm
          navigate={navigate}
          onClose={() => setShowSignUpForm(false)}
        />
      )}

      {showNotificationModal && (
        <NotificationModal
          navigate={navigate}
          onClose={() => setShowNotificationModal(false)}
        />
      )}

      {showFollowersModal && (
        <FollowerModal
          userId={userId}
          open={showFollowersModal}
          onClose={() => setShowFollowersModal(false)}
        />
      )}
    </div>
  );
};

export default App;
