const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Gets user and adds the friends
    const user = await User.findById(userId).populate(
      "friends",
      "firstName lastName profilePic"
    );

    if (!user) {
      return res.status(404).json({ok: false, message: "User not found" });
    }

    // Get the user's posts only
    const posts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("owner", "firstName lastName profilePic");

    //combined profile data of user only
    res.status(200).json({
      ok: true, message: "OK", data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        bio: user.bio,
        location: user.location,
        work: user.work,
        birthday: user.birthday,
        joined: user.joined,
        friends: user.friends,
        posts: posts,
      },
    });

  } catch (err) {
    console.error("Could not get user profile", err)
    console.error(err);
    res.status(500).json({ok: false,  message: "Service is down, please try again later" });
  }
});

module.exports = router;