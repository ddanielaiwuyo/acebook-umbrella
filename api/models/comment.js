const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    message: { type: String, required: true },
    post_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post', 
        required: true 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdTime: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
