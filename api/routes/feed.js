const express = require("express");
const router = express.Router();
const Post = require("../models/post");

async function getFeedPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("owner", "firstName lastName")
      .populate({
        path: "comments",
        populate: { path: "owner", select: "firstName lastName" },
      });
    return res.status(200).send({ ok: true, message: "ok", posts: posts });
  } catch (err) {
    console.error("Error occured in controllers/feed.js");
    console.error(err);
    res
      .status(500)
      .send({ ok: false, message: "Service is down, please try again later" });
    console.error(err.stack);
  }
}

router.get("/", getFeedPosts);
module.exports = router;
