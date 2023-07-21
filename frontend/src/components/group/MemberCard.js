import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MemberCard = ({ member }) => {
  const [memberAvatar, setMemberAvatar] = useState("");

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`/users/${member._id}/profileImage`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        setMemberAvatar(objectURL);
      } catch (error) {
        console.error("Error fetching member avatar:", error);
      }
    };

    fetchAvatar();
  }, [member._id]);

  return (
    <Link to={`/users/${member._id}`} className="member-card">
      <div className="avatar-container">
        <img
          src={memberAvatar}
          alt={`${member.username}'s avatar`}
          className="member-avatar"
        />
      </div>
      <p className="member-username">@{member.username}</p>
    </Link>
  );
};

export default MemberCard;
