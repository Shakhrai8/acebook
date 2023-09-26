import React, { useState } from "react";

const GroupForm = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const group = {
      name,
      description,
    };

    fetch("/groups/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(group),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        onClose(); 
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="modal-content">
      <button className="close-button" onClick={onClose}>
        X
      </button>
      <form onSubmit={handleSubmit} className="group-form">
        <label className="form-label">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-textarea"
          />
        </label>
        <button type="submit" className="form-button">
          Create Group
        </button>
      </form>
    </div>
  );
};

export default GroupForm;
