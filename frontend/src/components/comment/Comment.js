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
  const [liked, setLiked] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const currentUserId = localStorage.getItem("userId");

  const handleCommentLike = async () => {
    setLiked(!liked);
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
    <div
      className={`comment-container ${
        comment.postedAsGroup ? "own-comment" : ""
      } ${hasSubcomments ? "has-subcomments" : ""} ${
        expanded ? "expanded" : "collapsed"
      }`}
      data-cy="comment"
      key={comment._id}
      id={comment._id}
    >
      <div className="author-details">
        {comment.postedAsGroup && <div className="group-tag">Creator</div>}
        <div className="text-details">
          <Link
            to={
              currentUserId === comment.authorId
                ? `/profiles/${comment.authorId}`
                : `/users/${comment.authorId}`
            }
            className="link"
          >
            <div className="username">
              @{comment.postedAsGroup ? group?.name : comment.username}
            </div>
          </Link>
          <div className="time">{comment.time}</div>
        </div>
      </div>
      <div className="comment-content">
        <div className="comment-text">{comment.comment}</div>
        <div className="interactive-area">
          <div
            id="comment-like"
            className="like-button"
            onClick={handleCommentLike}
          >
            <svg
              className={`like-icon ${liked ? "liked" : ""}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.719,17.073l-6.562-6.51c-0.27-0.268-0.504-0.567-0.696-0.888C1.385,7.89,1.67,5.613,3.155,4.14c0.864-0.856,2.012-1.329,3.233-1.329c1.924,0,3.115,1.12,3.612,1.752c0.499-0.634,1.689-1.752,3.612-1.752c1.221,0,2.369,0.472,3.233,1.329c1.484,1.473,1.771,3.75,0.693,5.537c-0.19,0.32-0.425,0.618-0.695,0.887l-6.562,6.51C10.125,17.229,9.875,17.229,9.719,17.073 M6.388,3.61C5.379,3.61,4.431,4,3.717,4.707C2.495,5.92,2.259,7.794,3.145,9.265c0.158,0.265,0.351,0.51,0.574,0.731L10,16.228l6.281-6.232c0.224-0.221,0.416-0.466,0.573-0.729c0.887-1.472,0.651-3.346-0.571-4.56C15.57,4,14.621,3.61,13.612,3.61c-1.43,0-2.639,0.786-3.268,1.863c-0.154,0.264-0.536,0.264-0.69,0C9.029,4.397,7.82,3.61,6.388,3.61"></path>
            </svg>
            <span id="comment-like-counter" className="like-count">
              {comment.likes ? comment.likes.length : 0}
            </span>
          </div>
          <button onClick={handleToggleReply} className="reply-button">
            Reply
          </button>
          <div className="expand-button" onClick={handleToggleExpand}>
            {hasSubcomments && (expanded ? "Collapse" : "Expand")}
          </div>
        </div>
      </div>
      {renderReplyForm()}
      {expanded && hasSubcomments && (
        <div id="comment-feed" className={`comment-container expanded`}>
          {comments &&
            comments
              .filter((reply) => reply.parentId === comment._id)
              .map((reply) => (
                <div key={reply._id}>
                  <Comment
                    comment={reply}
                    comments={comments}
                    onNewComment={onNewComment}
                    token={token}
                    handleUpdatedCommentLikes={handleUpdatedCommentLikes}
                    group={group}
                    groupId={groupId}
                    postedAsGroup={postedAsGroup}
                  />
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
