import React, { useState } from "react";
import ImageUploadForm from "./ImageUploadForm";
import { Link } from "react-router-dom";
import MemberCard from "./MemberCard";
import Modal from "../common/Modal";

const GroupOwnerDetailsPage = ({
  group,
  members,
  posts,
  refetchGroup,
  PostForm,
  token,
  searchTerm,
  onUpdatedLikes,
  handleNewComment,
  comments,
  handleUpdatedCommentLikes,
  Post,
  onNewPost,
}) => {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [description, setDescription] = useState(group.description);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDescriptionSave = () => {
    fetch(`/groups/${group._id}/description`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description }),
    }).then(() => {
      setShowDescriptionModal(false); 
      refetchGroup(); 
    });
  };

  return (
    <div className="group-details">
      <div className="group-header">
        <div className="group-header-top">
          <h2 className="group-name">{group.name}</h2>
          <button
            className="change-image-button"
            onClick={() => setShowImageModal(true)}
          >
            Change Image
          </button>
        </div>
        {group.image && (
          <img className="group-image" src={group.image} alt={group.name} />
        )}
        {showImageModal && (
          <ImageUploadForm
            groupId={group._id}
            refetchGroup={refetchGroup}
            onClose={() => setShowImageModal(false)}
          />
        )}
        <div className="group-creator">
          Created by{" "}
          <Link to={`/profiles/${group.creator._id}`} className="link">
            you
          </Link>
        </div>
        <Modal
          open={showDescriptionModal}
          onClose={() => setShowDescriptionModal(false)}
        >
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowDescriptionModal(false)}
            >
              X
            </button>
            <p className="choose-container-description">
              Choose a new group description:
            </p>
            <input
              className="large-input"
              value={description}
              onChange={handleDescriptionChange}
              autoFocus
            />
            <button className="save-button" onClick={handleDescriptionSave}>
              Save
            </button>
          </div>
        </Modal>
        <p
          className="group-description"
          onClick={() => setShowDescriptionModal(true)}
        >
          {group.description}
        </p>
      </div>

      <h3>Members</h3>
      <div className="all-members-container">
        <div className="group-members">
          {members.slice(0, 8).map((member) => (
            <MemberCard key={member._id} member={member} />
          ))}
          {members.length > 8 && (
            <div className="members-extra">+{members.length - 8} More</div>
          )}
        </div>
      </div>

      <div className="create-post-container">
        <PostForm
          token={token}
          onNewPost={onNewPost}
          groupId={group._id}
          postedAsGroup={true}
        />
      </div>

      <div className="main-posts-container">
        <h2>Posts</h2>
        <div id="feed" role="feed">
          {posts
            .filter((post) =>
              post.message.toLowerCase().includes(searchTerm.toLowerCase())
            ) 
            .map((post) => (
              <div key={post._id} className="post-container">
                <Post
                  post={post}
                  token={token}
                  onUpdatedLikes={onUpdatedLikes}
                  handleNewComment={handleNewComment}
                  comments={comments}
                  handleUpdatedCommentLikes={handleUpdatedCommentLikes}
                  GroupImage={group.image}
                  group={group}
                  groupId={group._id}
                  postedAsGroup={true}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GroupOwnerDetailsPage;
