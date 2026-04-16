const Notification = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user_id })
      .populate("sender", "firstName lastName profilePic")
      .populate("post", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ ok: true, notifications });
  } catch (err) {
    console.error("Error fetching notifications", err);
    res.status(500).json({ ok: false, message: "Error fetching notifications" });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user_id,
      read: false,
    });

    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching unread count", err);
    res.status(500).json({ ok: false, message: "Error fetching unread count" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ ok: false, message: "Notification not found" });
    }

    res.status(200).json({ ok: true, notification });
  } catch (err) {
    console.error("Error marking notification as read", err);
    res.status(500).json({ ok: false, message: "Error updating notification" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user_id, read: false },
      { read: true }
    );

    res.status(200).json({ ok: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications as read", err);
    res.status(500).json({ ok: false, message: "Error updating notifications" });
  }
};

const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user_id });
    res.status(200).json({ ok: true, message: "All notifications cleared" });
  } catch (err) {
    console.error("Error clearing notifications", err);
    res.status(500).json({ ok: false, message: "Error clearing notifications" });
  }
};

const NotificationsController = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteAllNotifications,
};

module.exports = NotificationsController;