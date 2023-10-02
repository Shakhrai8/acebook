import React, { useState } from "react";
import "./SignUpForm.css";
import Modal from "../common/Modal";

const SignUpForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailValid(email)) {
      window.alert("Please enter a valid email address");
      return;
    }

    if (!isStrongPassword(password)) {
      window.alert(
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return;
    }

    fetch("/user", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: username,
      }),
    }).then((response) => {
      if (response.status === 201) {
        onClose();
      }
    });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isStrongPassword = (password) => {
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordPattern.test(password);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="signup-form">
          <form onSubmit={handleSubmit}>
            <label>
              <input
                placeholder="Email"
                id="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </label>
            <label>
              <input
                placeholder="Password"
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              <input
                placeholder="Username"
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </label>
            <input id="submit" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpForm;
