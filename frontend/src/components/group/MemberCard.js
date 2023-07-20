// MemberCard.js

import React from "react";

const MemberCard = ({ member }) => {
  return (
    <div className="member-card">
      <p>{member.username}</p>
      {/* You could add more member details here */}
    </div>
  );
};

export default MemberCard;
