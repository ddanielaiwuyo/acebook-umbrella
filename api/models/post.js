const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.
const CommentSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const PostSchema = new Schema(
  {
    owner: { 
      type: Types.ObjectId, 
      ref: "User", 
      required: [true, "A post must have an owner"] 
    },
    message: { 
      type: String, 
      required: [true, "Post content cannot be empty"],
      trim: true 
    },
    likeCounts: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    // Embedding the CommentSchema!
    comments: [CommentSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = model("Post", PostSchema);

module.exports = Post;
