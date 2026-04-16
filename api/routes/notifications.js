const express = require("express");
const router = express.Router();
const NotificationsController = require("../controllers/notifications");
console.log(NotificationsController);

router.get("/", NotificationsController.getNotifications);
router.get("/unread-count", NotificationsController.getUnreadCount);
router.patch("/read-all", NotificationsController.markAllAsRead);
router.patch("/:id/read", NotificationsController.markAsRead);
router.delete("/clear-all", NotificationsController.deleteAllNotifications);

module.exports = router;