import React, { useState } from "react";

const CommentForm = ({
  token,
  onNewComment,
  postId,
  groupId = null,
  postedAsGroup = false,
  parentId = null,
}) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const requestBody = {
        comment: comment,
        postId: postId,
        parentId: parentId,
      };

      if (groupId) {
        requestBody.groupId = groupId;
        requestBody.postedAsGroup = postedAsGroup;
      }

      const response = await fetch("/comments", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        if (data.comment) {
          onNewComment(data.comment);
          setComment("");
        }
      } else {
        console.error("Failed to post comment.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  return (
    <form
      className="comment-form"
      onSubmit={handleSubmit}
      class="comment-form d-none"
    >
      <textarea
        id="comment"
        name="comment"
        placeholder="Reply to comment"
        rows="4"
        required
        value={comment}
        onChange={handleCommentChange}
      ></textarea>
      <button id="comment-post-button" type="submit">
        Post
      </button>
    </form>
  );
};

export default CommentForm;
