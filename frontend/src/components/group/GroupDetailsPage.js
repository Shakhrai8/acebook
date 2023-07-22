import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MemberCard from "./MemberCard";
import Post from "../post/Post";
import GroupOwnerDetailsPage from "./GroupOwnerDetailsPage";
import PostForm from "../post/PostForm";

const GroupDetailsPage = ({ searchTerm }) => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const userId = localStorage.getItem("userId");
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [comments, setComments] = useState([]);

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setGroup(data);
      setCreator(data.creator);
      setMembers(data.members);
      setPosts(data.posts.reverse());
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroup(); // Use fetchGroup inside useEffect
  }, [id]);

  useEffect(() => {
    setIsOwner(group && group.creator._id === userId);
  }, [group, userId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (token && token !== "null" && token !== "undefined") {
        const response = await fetch("/comments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setComments(data.comments.reverse());
      } else {
        setComments([]); // Set empty comments array when there is no token
      }
    };

    fetchComments();
  }, [token]);

  const handleToggleMembership = async () => {
    await fetch(`/groups/${id}/toggleMembership`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // Add user id
    });

    fetchGroup(); // refetch group data to update the members list
  };

  const handleNewComment = (comment) => {
    setComments((prevComments) => {
      return [comment, ...prevComments];
    });
  };

  const handleUpdatedLikes = (postId, likes) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: likes } : post
      )
    );
  };

  const handleUpdatedCommentLikes = (commentId, likes) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId ? { ...comment, likes: likes } : comment
      )
    );
  };

  const handleNewPost = (post) => {
    setPosts((prevPosts) => {
      return [post, ...prevPosts];
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isOwner) {
    return (
      <GroupOwnerDetailsPage
        group={group}
        members={members}
        posts={posts}
        refetchGroup={fetchGroup}
        setPosts={setPosts}
        token={token}
        searchTerm={searchTerm}
        onUpdatedLikes={handleUpdatedLikes}
        handleNewComment={handleNewComment}
        comments={comments}
        handleUpdatedCommentLikes={handleUpdatedCommentLikes}
        Post={Post}
        onNewPost={handleNewPost}
        PostForm={PostForm}
      />
    );
  } else {
    return (
      <div className="group-details">
        <div className="group-header">
          <h2>{group.name}</h2>
          {group.image && (
            <img className="group-image" src={group.image} alt={group.name} />
          )}

          <p>
            Created by:{" "}
            <Link to={`/users/${creator._id}`} className="link">
              @{creator.username}
            </Link>
          </p>

          <p>{group.description}</p>
        </div>

        <h3>Members</h3>
        <div className="all-members-container">
          <div className="group-members">
            {members.slice(0, 8).map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
            {members.length > 8 && (
              <div className="members-extra">+{members.length - 8} More</div>
            )}
          </div>
          <button onClick={handleToggleMembership}>
            {members.find((member) => member._id === userId)
              ? "Leave Group"
              : "Join Group"}
          </button>
        </div>
        <div className="create-post-container">
          <PostForm
            token={token}
            onNewPost={handleNewPost}
            groupId={group._id}
            postedAsGroup={false}
          />
        </div>

        <div className="main-posts-container">
          <h2>Posts</h2>
          <div id="feed" role="feed">
            {posts
              .filter((post) =>
                post.message.toLowerCase().includes(searchTerm.toLowerCase())
              ) // Add filtering based on searchTerm here
              .map((post) => (
                <div key={post._id} className="post-container">
                  <Post
                    post={post}
                    token={token}
                    onUpdatedLikes={handleUpdatedLikes}
                    handleNewComment={handleNewComment}
                    comments={comments}
                    handleUpdatedCommentLikes={handleUpdatedCommentLikes}
                    GroupImage={group.image}
                    group={group}
                    groupId={group._id}
                    postedAsGroup={false}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
};

export default GroupDetailsPage;
