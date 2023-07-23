import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UsersToFollow = ({ token, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 5) % users.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentIndex, users.length]);

  const fetchUsers = async () => {
    const response = await fetch("/users/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setUsers(
      data.filter(
        (user) =>
          user._id !== currentUserId && !user.followers.includes(currentUserId)
      )
    );
  };

  return (
    <div className="users-to-follow-container">
      <h2>People you may want to follow</h2>
      {users.length === 0 ? (
        <p>No more people to follow!</p>
      ) : (
        users.slice(currentIndex, currentIndex + 5).map((user) => (
          <div className="user-recomendation-box" key={user._id}>
            <div className="author">
              <img className="author-image" src={user.image} alt="Author" />
            </div>
            <div className="username-section">
              <Link to={`/users/${user._id}`} className={"username"}>
                @{user.username}
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UsersToFollow;
