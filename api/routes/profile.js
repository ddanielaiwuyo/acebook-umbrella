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
      "name profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the user's posts only
    const posts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("owner", "name profilePic");

    //combined profile data of user only
    res.json({
      _id: user._id,
      name: user.name,
      profilePic: user.profilePic,
      bio: user.bio,
      location: user.location,
      work: user.work,
      birthday: user.birthday,
      joined: user.joined,
      friends: user.friends,
      posts: posts,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;