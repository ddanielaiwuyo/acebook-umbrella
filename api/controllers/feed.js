const express = require("express")
const router = express.Router()

const Post = require("../models/post")

async function getAllPostsForFeed(req, res) {
	// Upadte the user schema to take first and lastnames
	try {
		const posts = await Post.find().populate("owner", "email")
		console.log("All data to send to client:", posts)
		return res.status(200).send({ posts: posts })

	} catch (err) {
		console.error("Error occured in controllers/feed.js", err.message)
		res.status(500).send({ message: "Internal Server Error" })
		console.error(err.stack)
	}
}


router.get("/", getAllPostsForFeed)
module.exports = router
