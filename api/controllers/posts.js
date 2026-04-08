const Post = require("../models/post");
const Comment = require("../models/comment");
const { generateToken } = require("../lib/token");

// get all posts refactored for errors
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    const token = generateToken(req.user_id);
    res.status(200).json({ posts: posts, token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts!", error: error.message });
  }
};

// create a post (refactored for errors)
const createPost = async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();

    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "Post created", token: newToken });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating post!", error: error.message });
  }
};

// add a comment
const createComment = async (req, res) => {
  try {
    const { post_id, message } = req.body;

    const comment = new Comment({
      message: message,
      post_id: post_id,
      owner: req.user_id,
    });
    await comment.save();

    // Idk if we need a new token like in createPost ?? commented below
    // const newToken = generateToken(req.user_id);

    res.status(201).json({ message: "Comment added!", comment });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding comment!", error: error.message });
  }
};

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  createComment: createComment,
};

module.exports = PostsController;
