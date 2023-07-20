// PostCard.js

import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <h4>{post.title}</h4>
      <p>{post.body}</p>
      {/* You could add more post details here */}
    </div>
  );
};

export default PostCard;
