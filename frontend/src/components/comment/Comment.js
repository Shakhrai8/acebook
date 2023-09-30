import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { Link } from "react-router-dom";
import "./Comment.css";

const Comment = ({
  comment,
  onNewComment,
  comments,
  token,
  handleUpdatedCommentLikes,
  group,
  groupId,
  postedAsGroup,
}) => {
  const [liked, setLiked] = useState(
    localStorage.getItem(`comment_${comment._id}_liked`) === "true"
  );
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [expanded, setExpanded] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  const handleCommentLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(`comment_${comment._id}_liked`, newLiked.toString());
    
    const response = await fetch(`/comments/${comment._id}/like`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (onNewComment) {
      onNewComment(comment._id, data.likes);
    }
    if (handleUpdatedCommentLikes) {
      handleUpdatedCommentLikes(comment._id, data.likes);
    }
  };

  const handleToggleReply = () => {
    setReplying(!replying);
  };

  const handleReplyTextChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = async (event) => {
    event.preventDefault();
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const renderReplyForm = () => {
    if (replying) {
      return (
        <CommentForm
          token={token}
          onNewComment={onNewComment}
          postId={comment.postId}
          parentId={comment._id}
          groupId={groupId}
          postedAsGroup={postedAsGroup}
        />
      );
    }
    return null;
  };

  const hasSubcomments = comments.some(
    (subcomment) => subcomment.parentId === comment._id
  );

  return (
    <details
      open={expanded}
      className={`comment`}
      id={`comment-${comment._id}`}
      key={comment._id}
    >
      <a href={`#comment-${comment._id}`} className="comment-border-link">
        <span className="sr-only">Jump to comment-{comment._id}</span>
      </a>
      <summary>
        <div className="comment-heading">
          <div className="comment-info">
            <Link
              to={
                currentUserId === comment.authorId
                  ? `/profiles/${comment.authorId}`
                  : `/users/${comment.authorId}`
              }
              className="comment-author"
            >
              @{comment.postedAsGroup ? group?.name : comment.username}
            </Link>
            <p className="m-0">
              {comment.likes ? comment.likes.length : 0} points &bull;{" "}
              {comment.time}
            </p>
          </div>
        </div>
      </summary>

      <div className="comment-body" id={comment._id}>
        <p className="comment-text">{comment.comment}</p>
        <div className="button-container">
          <div
            id="comment-like"
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={handleCommentLike}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`upvote-icon ${liked ? "liked" : ""}`}
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            </svg>
            {comment.likes ? comment.likes.length : 0} points
          </div>

          <button
            type="button"
            onClick={handleToggleReply}
            className="reply-button"
          >
            Reply
          </button>
        </div>
      </div>
      {renderReplyForm()}
      <div className="replies">
        {hasSubcomments &&
          comments
            .filter((reply) => reply.parentId === comment._id)
            .map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                comments={comments}
                onNewComment={onNewComment}
                token={token}
                handleUpdatedCommentLikes={handleUpdatedCommentLikes}
                group={group}
                groupId={groupId}
                postedAsGroup={postedAsGroup}
              />
            ))}
      </div>
    </details>
  );
};

export default Comment;
