import React, { useState } from "react";
import Modal from "../common/Modal";

const ImageUploadForm = ({ groupId, refetchGroup, onClose }) => {
  const [image, setImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }

    fetch(`/groups/${groupId}/image`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          refetchGroup();
          setImage(null);
          onClose();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <p>Choose a new group picture:</p>
        <form className="group-image-form" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files[0])}
          />
          <button className="group-image-button" type="submit">
            Update Image
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ImageUploadForm;
