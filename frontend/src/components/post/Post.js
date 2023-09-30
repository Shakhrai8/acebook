import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import CommentForm from "../comment/CommentForm";
import Comment from "../comment/Comment";
import Modal from "../common/Modal";
import "./Post.css";

const Post = ({
  post,
  token,
  onUpdatedLikes,
  handleNewComment,
  comments,
  handleUpdatedCommentLikes,
  GroupImage,
  group,
  groupId,
  postedAsGroup,
  // showCommentForm = true,
}) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [authorImgSrc, setAuthorImgSrc] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const [liked, setLiked] = useState(
    localStorage.getItem(`post_${post._id}_liked_${currentUserId}`) === "true"
  );

  const idToScrollTo = window.localStorage.getItem("scrollToId");

  const onClose = () => {
    setIsZoomed(false);
  };

  const handleZoom = () => {
    setIsZoomed(true);
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

  const handlePostLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(
      `post_${post._id}_liked_${currentUserId}`,
      newLiked.toString()
    );

    const response = await fetch(`/posts/${post._id}/like`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (onUpdatedLikes) {
      onUpdatedLikes(post._id, data.likes);
    }
  };

  useEffect(() => {
    if (post._id && post.image && post.image.data) {
      // Check if the post has image data
      fetch(`/posts/image/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setImgSrc(objectURL);
        });
    }
  }, [post, token]);

  const authorId = useMemo(() => post.authorId, [post.authorId]);

  useEffect(() => {
    if (authorId) {
      fetch(`/profiles/${authorId}/profileImage`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.blob())
        .then((blob) => {
          const objectURL = URL.createObjectURL(blob);
          setAuthorImgSrc(objectURL);
          console.log("first");
        });
    }
  }, [authorId, token]);

  useEffect(() => {
    if (idToScrollTo) {
      setTimeout(() => {
        const element = document.getElementById(idToScrollTo);
        element?.scrollIntoView({ behavior: "smooth" });
        // Add the highlight class
        element?.classList.add("highlight");
        // Remove the highlight class after some delay
        setTimeout(() => element?.classList.remove("highlight"), 5000);
        window.localStorage.removeItem("scrollToId"); // important to remove after use
      }, 1000);
    }
  }, [idToScrollTo]);

  const renderReplyForm = () => {
    if (replying) {
      return (
        <CommentForm
          token={token}
          onNewComment={handleNewComment}
          postId={post._id}
          groupId={groupId}
          postedAsGroup={postedAsGroup}
        />
      );
    }
    return null;
  };

  return (
    <div
      className={`post-wrapper ${post.postedAsGroup ? "group-post-main" : ""}`}
    >
      <summary className="summary">
        <div className="post-heading">
          {post.postedAsGroup && <div className="group-tag">Creator</div>}
          <div className="author">
            <img
              className="author-image"
              src={post.postedAsGroup ? GroupImage : authorImgSrc}
              alt="Author"
            />
          </div>

          <div className="post-info">
            <Link
              to={
                currentUserId === post.authorId
                  ? `/profiles/${post.authorId}`
                  : `/users/${post.authorId}`
              }
              className="username"
            >
              @{post.postedAsGroup ? group?.name : post.username}
            </Link>
            <p className="m-0">
              {post.likes ? post.likes.length : 0} points &bull; {post.time}
            </p>
          </div>
        </div>
      </summary>

      <div className="post-body" id={post._id}>
        <p className="post-text">{post.message}</p>
        {imgSrc && (
          <div
            className={`post-container ${isZoomed ? "zoom-active" : ""}`}
            data-cy="post"
            key={post._id}
          >
            <div className="post-image-container">
              <img
                className="post-image"
                src={imgSrc}
                alt="Post"
                onClick={handleZoom}
              />

              <Modal open={isZoomed} onClose={onClose}>
                <div className="modal-content">
                  <button className="close-button" onClick={onClose}>
                    X
                  </button>
                  <div className="image-zoom">
                    <img
                      className="zoomed-image"
                      src={imgSrc}
                      alt="Zoomed Post"
                    />
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        )}
        <div className="button-container">
          <div
            id="post-like"
            className={`like-button ${liked ? "liked" : ""}`}
            onClick={handlePostLike}
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
            {post.likes ? post.likes.length : 0} points
          </div>

          <button
            type="button"
            onClick={handleToggleReply}
            className="reply-button"
          >
            Reply
          </button>
        </div>

        {renderReplyForm()}
        <div id="comment-feed">
          {comments &&
            comments
              .filter(
                (comment) =>
                  comment.postId === post._id && comment.parentId === null
              )
              .map((comment) => (
                <Comment
                  key={comment._id}
                  comments={comments}
                  comment={comment}
                  onNewComment={handleNewComment}
                  token={token}
                  handleUpdatedCommentLikes={handleUpdatedCommentLikes}
                  group={group}
                  groupId={groupId}
                  postedAsGroup={postedAsGroup}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
