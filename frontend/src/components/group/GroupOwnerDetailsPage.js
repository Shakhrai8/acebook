import React, { useState } from "react";
import ImageUploadForm from "./ImageUploadForm";
import MemberCard from "./MemberCard";
import PostCard from "./PostCard";

const GroupOwnerDetailsPage = ({ group, members, posts }) => {
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(group.description);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleDescriptionEdit = () => {
    setEditingDescription(true);
  };

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
      setEditingDescription(false);
    });
  };

  const handleImageChange = () => {};

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
            onImageChange={handleImageChange}
            onClose={() => setShowImageModal(false)}
          />
        )}

        <p>Created by: {group.creator.username}</p>
        {editingDescription ? (
          <>
            <input
              value={description}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionSave}
              autoFocus
            />
          </>
        ) : (
          <p onClick={handleDescriptionEdit}>{group.description}</p>
        )}
      </div>
      <h3>Members</h3>
      <div className="group-members">
        {members.map((member) => (
          <MemberCard key={member._id} member={member} />
        ))}
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
