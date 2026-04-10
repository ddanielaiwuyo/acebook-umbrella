const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  profilePic: { type: String },
  bio: { type: String },
  location: { type: String },
  work: { type: String },
  bio: { type: String },
  birthday: { type: String },
  joined: { type: String },

  friends: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User"}
  ]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
