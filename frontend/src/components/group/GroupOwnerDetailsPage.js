import React, { useState } from "react";
import ImageUploadForm from "./ImageUploadForm";
import MemberCard from "./MemberCard";
import Modal from "../common/Modal";
import PostCard from "./PostCard";

const GroupOwnerDetailsPage = ({ group, members, posts, refetchGroup }) => {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [imageUpdateTime, setImageUpdateTime] = useState(Date.now());
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
      setShowDescriptionModal(false); // close the modal
      refetchGroup(); // refetch group data
    });
  };

  return (
    <div className="group-details">
      <div className="group-header">
        <h2>{group.name}</h2>
        {group.image && (
          <img className="group-image" src={group.image} alt={group.name} />
        )}
        <button
          className="change-image-button"
          onClick={() => setShowImageModal(true)}
        >
          Change Image
        </button>
        {showImageModal && (
          <ImageUploadForm
            groupId={group._id}
            refetchGroup={refetchGroup}
            onClose={() => setShowImageModal(false)}
          />
        )}
        <p>Created by: {group.creator.username}</p>
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
            <p>Choose a new group description:</p>
            <input
              value={description}
              onChange={handleDescriptionChange}
              autoFocus
            />
            <button onClick={handleDescriptionSave}>Save</button>
          </div>
        </Modal>
        <p onClick={() => setShowDescriptionModal(true)}>{group.description}</p>
      </div>
      <h3>Members</h3>
      <div className="group-members">
        {members.slice(0, 8).map((member) => (
          <MemberCard key={member._id} member={member} />
        ))}
        {members.length > 8 && (
          <div className="members-extra">+{members.length - 8} More</div>
        )}
      </div>

      <h3>Posts</h3>
      <div className="group-posts">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default GroupOwnerDetailsPage;
