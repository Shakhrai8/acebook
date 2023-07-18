import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import GroupForm from "./GroupForm";

const GroupPage = () => {
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const handleModal = () => setShowModal(!showModal);

  useEffect(() => {
    fetch("groups/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="followers-content">
      <h2>Groups</h2>
      <button onClick={handleModal}>Create Group</button>
      {groups.length > 0 ? (
        groups.map((group) => (
          <Link
            key={group._id}
            to={`/groups/${group._id}`}
            className="item-card"
          >
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
            <div className="item-card-info-wrapper">
              <div className="item-card-info">
                <h2>{group.name}</h2>
                <p>{group.description}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No groups to display</p>
      )}
      <Modal open={showModal} onClose={handleModal}>
        <GroupForm onClose={handleModal} />
      </Modal>
    </div>
  );
};

export default GroupPage;
