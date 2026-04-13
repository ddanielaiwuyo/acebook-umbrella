const User = require("../models/user");

async function addFriendRequest(req, res) {
  try {
    const senderId = req.user_id;
    const receiverId = req.params.id;
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    const alreadySent = sender.sentFriendRequests.find(
      (request) => request.user.toString() === receiverId,
    );
    if (alreadySent) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    sender.sentFriendRequests.push({
      user: receiverId,
      status: "pending",
    });

    receiver.receivedFriendRequests.push({
      user: senderId,
      status: "pending",
    });

    await sender.save();
    await receiver.save();

    res
      .status(200)
      .json({ ok: true, message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error occured while trying to send friend request");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

//This function is for accepting friend requests
async function acceptFriendRequest(req, res) {
  try {
    const receiverId = req.user_id;
    const senderId = req.params.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);
    const alreadyFriends = receiver.friends.find(
      (id) => id.toString() === senderId,
    );
    if (alreadyFriends) {
      return res.status(400).json({ message: "Already friends" });
    }
    receiver.friends.push(senderId);

    sender.friends.push(receiverId);

    sender.sentFriendRequests.pull({
      user: receiverId,
    });

    receiver.receivedFriendRequests.pull({
      user: senderId,
    });

    await sender.save();
    await receiver.save();

    res
      .status(200)
      .json({ ok: true, message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error occured while trying to accept friend request");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

//This function is for deleteing friend requests
async function deleteFriendRequest(req, res) {
  try {
    const receiverId = req.user_id;
    const senderId = req.params.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    sender.sentFriendRequests.pull({
      user: receiverId,
    });

    receiver.receivedFriendRequests.pull({
      user: senderId,
    });

    await sender.save();
    await receiver.save();

    res
      .status(200)
      .json({ ok: true, message: "Friend request deleted successfully" });
  } catch (error) {
    console.error("Error occured while trying to delete friend request");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

//This gets receieved friend requests data
async function getFriendRequests(req, res) {
  try {
    const userId = req.user_id;
    const user = await User.findById(userId).populate(
      "receivedFriendRequests.user",
    );
    const userFriendrequests = user.receivedFriendRequests;
    res.status(200).json({
      ok: true,
      message: "Friend requests retrieved successfully",
      friendRequests: userFriendrequests,
    });
  } catch (error) {
    console.error("Error occured while trying to get friend requests");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

async function getFriends(req, res) {
  try {
    const userId = req.user_id;
    const user = await User.findById(userId).populate("friends");
    const userFriends = user.friends;
    res.status(200).json({
      ok: true,
      message: "List of friends retrieved successfully",
      friends: userFriends,
    });
  } catch (error) {
    console.error("Error occured while trying to get list of friends");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

//This function is getting users for people you may know section
// Users gotten are not in the friends array and also in the sent or received friend requests array
async function getOtherUsers(req, res) {
  try {
    const userId = req.user_id;
    const user = await User.findById(userId);
    const userFriendsId = user.friends;
    const userSentRequestId = user.sentFriendRequests.map(
      (request) => request.user,
    );
    const userReceivedRequestId = user.receivedFriendRequests.map(
      (request) => request.user,
    );

    const excludedIds = [
      ...userFriendsId,
      ...userSentRequestId,
      ...userReceivedRequestId,
      userId,
    ];

    const otherUsers = await User.find({ _id: { $nin: excludedIds } });
    res.status(200).json({
      ok: true,
      message: "List of other users retrieved successfully",
      otherUsers: otherUsers,
    });
  } catch (error) {
    console.error("Error occured while trying to get list of other users");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

//This function removes friends from friends array of users
async function removeFriends(req, res) {
  try {
    const removerId = req.user_id;
    const removedId = req.params.id;

    const removerUser = await User.findById(removerId);
    const removedUser = await User.findById(removedId);

    removerUser.friends.pull(removedId);

    removedUser.friends.pull(removerId);

    await removerUser.save();
    await removedUser.save();

    res.status(200).json({ ok: true, message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error occured while trying to remove friend");
    console.log(error, error.stack);
    res.status(500).json({
      ok: false,
      message: "Sorry this service is down, please try again later",
    });
  }
}

const FriendsController = {
  addFriendRequest: addFriendRequest,
  getFriendRequests: getFriendRequests,
  getFriends: getFriends,
  getOtherUsers: getOtherUsers,
  acceptFriendRequest: acceptFriendRequest,
  deleteFriendRequest: deleteFriendRequest,
  removeFriend: removeFriends,
};

module.exports = FriendsController;
