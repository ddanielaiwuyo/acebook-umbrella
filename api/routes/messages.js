const express = require("express");

const MessagesController = require("../controllers/messages");

const router = express.Router();

router.post("/:id", MessagesController.sendMessage);
router.get("/inbox", MessagesController.getInbox);
router.get("/:id", MessagesController.getConversation);
router.patch("/:id/read", MessagesController.markAsRead);
module.exports = router;
