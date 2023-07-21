import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import "./Notification.css";
import { Link, useNavigate } from "react-router-dom";

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const token = window.localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && token !== "null" && token !== "undefined") {
      fetch("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => setNotifications(data.notifications))
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    }
  }, [token]);

  const deleteNotification = (id) => {
    fetch(`/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setNotifications(
          notifications.filter((notification) => notification._id !== id)
        );
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const scrollToElement = (elementId) => {
    window.localStorage.setItem("scrollToId", elementId);
    navigate("/");
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="notifications-list">
          {notifications.map((notification) => {
            let buttonText;
            let actionOnClick;
            let linkPath;

            switch (notification.type) {
              case "follow":
                buttonText = "View User";
                linkPath = `/users/${notification.originUserId}`;
                break;
              case "membership":
                buttonText = "View User";
                linkPath = `/users/${notification.originUserId}`;
                break;
              case "mention":
                buttonText = "View Mention";
                actionOnClick = () => {
                  if (notification.postId) {
                    scrollToElement(notification.postId);
                  } else if (notification.commentId) {
                    scrollToElement(notification.commentId);
                  }
                };
                break;
              case "comment":
                buttonText = "View Comment";
                actionOnClick = () => scrollToElement(notification.commentId);
                break;
              default:
                buttonText = "View Post";
                actionOnClick = () => scrollToElement(notification.postId);
            }

            return (
              <div className="notification-item" key={notification._id}>
                <p>{notification.message}</p>
                {linkPath ? (
                  <Link to={linkPath} onClick={onClose}>
                    <button>{buttonText}</button>
                  </Link>
                ) : (
                  <button onClick={actionOnClick}>{buttonText}</button>
                )}
                <button onClick={() => deleteNotification(notification._id)}>
                  Dismiss
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
