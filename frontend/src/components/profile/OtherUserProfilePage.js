import React, { useState, useEffect } from "react";
import Post from "../post/Post";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";

const OtherUserProfilePage = () => {
  const { id } = useParams();
  console.log(`id is ${id}`);
  const [profileData, setProfileData] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageSrc, setProfileImageSrc] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    fetch(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data);
        setName(data.name);
        setBio(data.bio);

        if (data.image) {
          fetch(`/users/${id}/profileImage`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => response.blob())
            .then((blob) => {
              const objectURL = URL.createObjectURL(blob);
              setProfileImageSrc(objectURL);
            })
            .catch((error) => {
              console.error("Error fetching profile image:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  };

  const handleProfileDataChange = () => {
    fetchProfileData();
  };

  if (!profileData) {
    return <div>Loading profile...</div>;
  }

  const { username, followers, posts } = profileData;

  return (
    <div className="container">
      <header className="header">
        <h1>Profile</h1>
      </header>

      <div className="banner">
        <div className="profile-picture-container">
          <div className="profile-photo">
            <img
              src={profileImageSrc}
              alt="Profile"
              className="profile-picture"
            />
          </div>
        </div>
      </div>

      <div className="user-info-container">
        <div className="name-container">
          <h2 className="name">{name}</h2>
        </div>
        <div className="username-followers-container">
          <p className="username">@{username}</p>
          <p className="followers">{followers} Followers</p>
        </div>
        <div className="bio-container">
          <h3 className="bio-label">Biography</h3>
          <p className="bio">{bio}</p>
        </div>
      </div>

      <div className="my-posts-container">
        <h2>Posts</h2>
        <div className="my-posts">
          {posts.map((post) => (
            <div key={post._id} className="post-container">
              <Post
                post={post}
                token={localStorage.getItem("token")}
                key={post._id}
                onUpdatedLikes={handleProfileDataChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfilePage;
