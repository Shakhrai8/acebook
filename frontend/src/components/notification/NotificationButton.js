import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import "./Notification.css"

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const token = window.localStorage.getItem("token");

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

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="notifications-list">
          {notifications.map((notification) => {
            const scrollToPost = () => {
              const postElement = document.getElementById(notification.postId);
              postElement?.scrollIntoView({ behavior: "smooth" });
              onClose();
            };

            return (
              <div className="notification-item" key={notification._id}>
                <p>{notification.message}</p>
                <button onClick={scrollToPost}>View Post</button>
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
