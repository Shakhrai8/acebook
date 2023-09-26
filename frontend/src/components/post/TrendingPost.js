import React, { useEffect, useState } from "react";
import Post from "./Post";

const TrendingPosts = ({ token }) => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTrendingPosts();

    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % trendingPosts.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [currentIndex, trendingPosts.length]);

  const fetchTrendingPosts = async () => {
    const response = await fetch("/posts/trending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setTrendingPosts(data.posts);
  };

  return (
    <div className="trending-container">
      <h2>Top Liked Posts</h2>
      <div className="post-stage">
        {trendingPosts.length > 0 && (
          <Post
            key={trendingPosts[currentIndex]._id}
            post={trendingPosts[currentIndex]}
            token={token}
            showCommentForm={false}
            GroupImage={
              trendingPosts[currentIndex].groupId
                ? trendingPosts[currentIndex].groupId.image
                : null
            }
            group={trendingPosts[currentIndex].groupId}
            groupId={
              trendingPosts[currentIndex].groupId
                ? trendingPosts[currentIndex].groupId._id
                : null
            }
          />
        )}
      </div>
    </div>
  );
};

export default TrendingPosts;
