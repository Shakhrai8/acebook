import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import GroupForm from "./GroupForm";

import "./Group.css";

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
        console.log(groups);
      })
      .catch((error) => console.error(error));
  }, [groups]);

  return (
    <div className="groups-content">
      <div className="header-banner">
        <h2>All Groups</h2>
        <button className="create-grp-btn" onClick={handleModal}>
          Create Group
        </button>
      </div>
      {groups.length > 0 ? (
        <div className="group-grid">
          {groups.map((group) => (
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
      <Modal open={showModal} onClose={handleModal}>
        <GroupForm onClose={handleModal} />
      </Modal>
    </div>
  );
};

export default GroupPage;
