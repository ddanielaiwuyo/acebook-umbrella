const mongoose = require("mongoose");
const Comment = require("./comment");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
