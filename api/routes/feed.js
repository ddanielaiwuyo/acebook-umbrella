const express = require("express");
const router = express.Router();
const Post = require("../models/post");

async function getFeedPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("owner", "firstName lastName")
      .populate({
        path: "comments",
				populate: {path: "owner", select: "firstName lastName"},
      });
    return res.status(200).send({ posts: posts });
  } catch (err) {
    console.error("Error occured in controllers/feed.js", err.message);
    res.status(500).send({ message: "Internal Server Error" });
    console.error(err.stack);
  }
}

router.get("/", getFeedPosts);
module.exports = router;
