const mongoose = require("mongoose")
const { Schema } = require("mongoose")
const CommentSchema = new Schema({
	username: String,
	comment: String,
})

const Comment = mongoose.model("Comment", CommentSchema)


// TODO: Might also be worth attaching a Post to a users'Id
const PostSchema = new Schema({
	owner: String,
	message: String,
	likeCounts: Number,
	// an array of comments
	comments: [CommentSchema],
})

const Post = mongoose.model("Post", PostSchema)
module.exports = { Post, Comment }
