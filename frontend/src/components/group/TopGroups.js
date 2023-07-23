import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TopGroups = () => {
  const [topGroups, setTopGroups] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("groups/top", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTopGroups(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="top-groups-content">
      <div className="header-banner-community">
        <h2>Community Highlights</h2>
      </div>
      {topGroups.length > 0 ? (
        <div className="group-grid">
          {topGroups.map((group) => (
            <Link
              key={group._id}
              to={`/groups/${group._id}`}
              className="group-card"
            >
              {group.image && (
                <div className="group-card-image">
                  <img
                    src={group.image}
                    alt={group.name}
                    onLoad={() => setLoading(false)}
                    style={{ display: isLoading ? "none" : "block" }}
                  />
                  {isLoading && <div className="spinner"></div>}
                </div>
              )}
              <div className="group-card-info">
                <h2>{group.name}</h2>
                <p>{group.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No groups to display</p>
      )}
    </div>
  );
};

export default TopGroups;
