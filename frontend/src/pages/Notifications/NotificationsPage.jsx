import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationsPage.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GB");
}

function notificationText(type) {
  switch (type) {
    case "comment": return "commented on your post";
    case "like": return "liked your post";
    case "friend_request": return "sent you a friend request";
    default: return "interacted with you";
  }
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await fetch(`${BACKEND_URL}/notifications/${notification._id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }

    if (notification.post) {
      navigate(`/feed`, { state: { highlightPostId: notification.post._id } });
    } else if (notification.type === "friend_request") {
      navigate(`/friends`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${BACKEND_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch(`${BACKEND_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <div className="notifications-loading">Loading...</div>;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <div className="notifications-header-buttons">
          {unreadCount > 0 && (
            <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="clear-all-btn" onClick={handleClearAll}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="notifications-empty">
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => {
            const senderName = notification.sender
              ? `${notification.sender.firstName ?? ""} ${notification.sender.lastName ?? ""}`.trim() || "Someone"
              : "Someone";

            return (
              <div
                key={notification._id}
                className={`notification-item ${notification.read ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-avatar">
                  {notification.sender?.profilePic ? (
                    <img src={notification.sender.profilePic} alt={senderName} />
                  ) : (
                    <div className="notification-avatar-placeholder">
                      {senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="notification-content">
                  <p>
                    <strong>{senderName}</strong> {notificationText(notification.type)}
                    {notification.post && (
                      <span className="notification-post-title">
                        {" "}— {notification.post.title}
                      </span>
                    )}
                  </p>
                  <span className="notification-time">
                    {timeAgo(notification.createdAt)}
                  </span>
                </div>
                {!notification.read && <div className="notification-dot" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}