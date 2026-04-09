const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	profileImg: { type: String },
	email: { type: String, required: true },
	password: { type: String, required: true },
	friends: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	sentFriendRequests: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			status: {
				type: String,
				enum: ["pending", "accepted", "rejected"],
				default: "pending",
			},
		},
	],
	receivedFriendRequests: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			status: {
				type: String,
				enum: ["pending", "accepted", "rejected"],
				default: "pending",
			},
		},
	],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
