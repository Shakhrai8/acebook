import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GroupDetailsPage = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/groups/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [id]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>{group.name}</h2>
          {group.image && (
            <div className="item-card-image">
              <img
                src={group.image}
                alt={group.name}
                onLoad={() => setLoading(false)}
                style={{ display: isLoading ? "none" : "block" }}
              />
              {isLoading && <div className="spinner"></div>}
            </div>
          )}
          <p>{group.description}</p>
        </div>
      )}
    </div>
  );
};

export default GroupDetailsPage;
