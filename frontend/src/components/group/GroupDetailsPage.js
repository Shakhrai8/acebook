import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MemberCard from "./MemberCard";
import PostCard from "./PostCard";
import GroupOwnerDetailsPage from "./GroupOwnerDetailsPage";

const GroupDetailsPage = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const userId = localStorage.getItem("userId");

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
      setPosts(data.posts);
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
        <div className="group-members">
          {members.map((member) => (
            <MemberCard key={member._id} member={member} />
          ))}
        </div>
        <button onClick={handleToggleMembership}>
          {members.find((member) => member._id === userId)
            ? "Leave Group"
            : "Join Group"}
        </button>

        <h3>Posts</h3>
        <div className="group-posts">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    );
  }
};

export default GroupDetailsPage;
