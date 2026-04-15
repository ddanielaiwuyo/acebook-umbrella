const Post = require("../models/post");
const Comment = require("../models/comment");
const { generateToken, decodeToken } = require("../lib/token");

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
  
    const header = req.headers
    const splitHeaders = header.authorization.split(" ")[1]
    console.log(splitHeaders);
    const result = decodeToken (splitHeaders)
    const user_id = result.sub
    const comment = new Comment({
      message: message,
      post_id: post_id,
      owner: user_id,
    });
    await comment.save();
    await Post.findByIdAndUpdate(post_id, {
        $push: { comments: comment._id }
    });

    // Idk if we need a new token like in createPost ?? commented below
    const newToken = generateToken(user_id);

    res.status(201).json({ message: "Comment posted!", comment, token: newToken });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Sorry this service is down! Try again later!" });
  }
};

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  createComment: createComment,
};

module.exports = PostsController;
