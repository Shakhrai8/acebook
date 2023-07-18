// GroupForm.js
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
        onClose(); // close the modal after submitting the form
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="modal-content">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default GroupForm;
