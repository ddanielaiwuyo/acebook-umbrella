const express = require("express");

const FriendsController = require("../controllers/friends")

const router = express.Router();

router.post("/:id", FriendsController.addFriendRequest);
router.get("/", FriendsController.getFriends)
router.get("/other-users", FriendsController.getOtherUsers)
router.get("/friend-requests", FriendsController.getFriendRequests);
router.patch("/:id/accept", FriendsController.acceptFriendRequest)
router.patch("/:id/delete", FriendsController.deleteFriendRequest)
router.patch("/:id/remove", FriendsController.removeFriend);

module.exports = router;
