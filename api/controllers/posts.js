const Post = require("../models/post");
const Comment = require("../models/comment");
const Notification = require("../models/notification");
const { generateToken, decodeToken } = require("../lib/token");

// get all posts refactored for errors
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const token = generateToken(req.user_id);
    res.status(200).json({ posts: posts, token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts!", error: error.message });
  }
};

// create a post (refactored for errors)
// const createPost = async (req, res) => {
//   try {
//     const post = new Post(req.body);
//     await post.save();

//     const newToken = generateToken(req.user_id);
//     res.status(201).json({ message: "Post created", token: newToken });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error creating post!", error: error.message });
//   }
// };
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      owner: req.user_id,
      likeCount: 0,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("owner")
      .populate({
        path: "comments",
        populate: {
          path: "owner",
          model: "User",
        },
      });

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({
      message: "Error creating post!",
      error: error.message,
    });
  }
};

// add a comment
const createComment = async (req, res) => {
  try {
    const { post_id, message } = req.body;
  
    const header = req.headers
    const splitHeaders = header.authorization.split(" ")[1]
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

    try {
      const post = await Post.findById(post_id);
      if (post && post.owner.toString() !== user_id.toString()) {
        await Notification.create({
          recipient: post.owner,
          sender: user_id,
          type: "comment",
          post: post_id,
        });
      }
    } catch (notifErr) {
      console.error("Failed to create comment notification", notifErr);
    }




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
