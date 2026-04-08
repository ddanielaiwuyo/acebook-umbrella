const express = require("express")
const router = express.Router();

const PostsControler = require("../controllers/posts")

router.get("/", PostsControler.getAllPosts)
module.exports = router
