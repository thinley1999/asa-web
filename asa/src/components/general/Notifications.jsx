import React, { useEffect, useState, useRef } from "react";
import cable from "../../cable";
import moment from "moment";

const Notifications = ({
  profileImage,
  handleNotificationCount,
  closeNotification,
  showNotification,
}) => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const toastRef = useRef(null);

  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "NotificationsChannel", token: token },
      {
        connected() {
          console.log("Connected to NotificationsChannel");
        },
        disconnected() {
          console.log("Disconnected from NotificationsChannel");
        },
        received(data) {
          if (
            !notifications.some((notification) => notification.id === data.id)
          ) {
            setNotifications((prevNotifications) => [
              data,
              ...prevNotifications,
            ]);
            handleNotificationCount((prevCount) => prevCount + 1);
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [token]);

  const formatDate = (date) => {
    const now = moment();
    const notificationDate = moment(date);
    if (now.isSame(notificationDate, "day")) {
      return "Today";
    }
    return notificationDate.format("MMM D, YYYY");
  };

  useEffect(() => {
    handleNotificationCount(notifications.length);
  }, [notifications, handleNotificationCount]);

  // Function to group notifications by date
  const groupNotificationsByDate = (notifications) => {
    const grouped = {};
    notifications.forEach((notification) => {
      const date = formatDate(notification.created_at);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    return grouped;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    showNotification && (
      <div
        className="toast show"
        ref={toastRef}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ display: notifications.length > 0 ? "block" : "block" }}
        id="notification"
      >
        <div className="toast-header">
          <h6 className="me-auto text-primary">Notifications</h6>
          <a href="#">Mark all as read</a>
          <button
            type="button"
            className="btn-close"
            onClick={closeNotification}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body bg-white">
          {Object.keys(groupedNotifications).map((date, index) => (
            <div key={index}>
              {date === "Today" && <p className="textsubheading">Today</p>}
              {date !== "Today" && <p className="textsubheading">{date}</p>}
              {groupedNotifications[date].map((notification, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <img
                    src={profileImage}
                    className="rounded-circle me-2"
                    style={{ width: "6vh", height: "6vh" }}
                    alt="Profile"
                  />
                  <div className="ms-3">
                    <p className="textsubheading">
                      {notification.message}.
                      <span>
                        <a
                          href={notification.detail_url}
                          className="text-decoration-none"
                        >
                          Click here to see more.
                        </a>
                      </span>
                    </p>
                    <small className="text-primary">
                      {moment(notification.created_at).fromNow()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Notifications;
