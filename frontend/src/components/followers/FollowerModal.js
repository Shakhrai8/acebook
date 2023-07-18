import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import "./FollowerModal.css";

const FollowersModal = ({ userId, open, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState("Followers");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = () => {
    fetch(`/users/${userId}/followers-and-following`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProfileData(data);
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  };

  const handleFollowClick = (followingId) => {
    fetch(`/users/${followingId}/updateFollow`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        fetchProfileData(); // Fetch profile data again to reflect the updated followers count
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const createImageBlobURL = (base64String) => {
    const blob = b64toBlob(base64String, "image/jpeg");
    return URL.createObjectURL(blob);
  };

  // if (!profileData) {
  //   return <div>Loading profile data...</div>;
  // }
  // appears for a split second outside the modal

  const followers = profileData.filter((item) => item.type === "follower");
  const following = profileData.filter((item) => item.type === "following");

  let content;
  if (activeTab === "Followers") {
    content = (
      <div className="followers-content">
        <h2>Followers</h2>
        {followers.length > 0 ? (
          followers.map((follower) => (
            <div key={follower._id} className="item-card">
              {follower.image && (
                <div className="item-card-image">
                  <img
                    src={createImageBlobURL(follower.image)}
                    alt="Profile"
                    onLoad={() => setLoading(false)}
                    style={{ display: isLoading ? "none" : "block" }}
                  />
                  {isLoading && <div className="spinner"></div>}
                </div>
              )}
              <div className="item-card-info-wrapper">
                <div className="item-card-info">
                  <Link
                    to={`/users/${follower._id}`}
                    onClick={onClose}
                    className="link"
                  >
                    <p>@{follower.username}</p>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No followers to display.</p>
        )}
      </div>
    );
  } else if (activeTab === "Following") {
    content = (
      <div className="following-content">
        <h2>Following</h2>
        {following.length > 0 ? (
          following.map((followingUser) => (
            <div key={followingUser._id} className="item-card">
              {followingUser.image && (
                <div className="item-card-image">
                  <img
                    src={createImageBlobURL(followingUser.image)}
                    alt="Profile"
                    onLoad={() => setLoading(false)}
                    style={{ display: isLoading ? "none" : "block" }}
                  />
                  {isLoading && <div className="spinner"></div>}
                </div>
              )}
              <div className="item-card-info-wrapper">
                <div className="item-card-info">
                  <Link
                    to={`/users/${followingUser._id}`}
                    onClick={onClose}
                    className="link"
                  >
                    <p>@{followingUser.username}</p>
                  </Link>
                </div>
                <div className="item-card-action">
                  <button onClick={() => handleFollowClick(followingUser._id)}>
                    Unfollow
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No following users to display.</p>
        )}
      </div>
    );
  }

  return (
    <Modal open={open} onClose={onClose} className="custom-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="followers-modal">
          <div className="tab-list">
            <button
              className={activeTab === "Followers" ? "active" : ""}
              onClick={() => handleTabChange("Followers")}
            >
              Followers
            </button>
            <button
              className={activeTab === "Following" ? "active" : ""}
              onClick={() => handleTabChange("Following")}
            >
              Following
            </button>
          </div>
          {content}
        </div>
      </div>
    </Modal>
  );
};

export default FollowersModal;
