const Message = require("../models/message");
const User = require("../models/user");

async function sendMessage(req, res) {
	try {
		const senderId = req.user_id;
		const receiverId = req.params.id;
		const { content } = req.body;

		const newMessage = await Message.create({
			sender: senderId,
			receiver: receiverId,
			content: content,
		});

		await newMessage.populate("sender receiver", "firstName lastName")

		await newMessage.save();

		res.status(201).json({
			ok: true,
			message: "Message sent",
			newMessage,
		});
	} catch (error) {
		console.error("Error occured while trying to send message");
		console.log(error, error.stack);
		res.status(500).json({
			ok: false,
			message: "Sorry this service is down, please try again later",
		});
	}
}

async function getConversation(req, res) {
	try {
		const userId = req.user_id;
		const otherUserId = req.params.id;
		const otherUser = await User.findById(otherUserId).select(
			"firstName lastName",
		);

		const messages = await Message.find({
			$or: [
				{ sender: userId, receiver: otherUserId },
				{ sender: otherUserId, receiver: userId },
			],
		})
			.populate("sender receiver", "firstName lastName")
			.sort({ createdAt: 1 });

		res
			.status(200)
			.json({ ok: true, messages: messages, otherUser: otherUser });
	} catch (error) {
		console.error("Error occured while trying to get conversation");
		console.log(error, error.stack);
		res.status(500).json({
			ok: false,
			message: "Sorry this service is down, please try again later",
		});
	}
}

async function getInbox(req, res) {
	try {
		const userId = req.user_id;

		const messages = await Message.find({
			$or: [{ sender: userId }, { receiver: userId }],
		})
			.populate("sender receiver", "firstName lastName")
			.sort({
				createdAt: -1,
			});

		const seen = new Set();
		const conversations = messages.filter((msg) => {
			const otherId =
				msg.sender._id.toString() === userId
					? msg.receiver._id.toString()
					: msg.sender._id.toString();

			if (seen.has(otherId)) return false;
			seen.add(otherId);
			return true;
		});

		res.status(200).json({
			ok: true,
			messages: conversations,
		});
	} catch (error) {
		console.error("Error occured while trying to get inbox");
		console.log(error, error.stack);
		res.status(500).json({
			ok: false,
			message: "Sorry this service is down, please try again later",
		});
	}
}

async function markAsRead(req, res) {
	try {
		const userId = req.user_id;
		const otherUserId = req.params.id;

		await Message.updateMany(
			{ sender: otherUserId, receiver: userId },
			{ $set: { isRead: true } },
		);

		res.status(200).json({ ok: true });
	} catch (error) {
		console.error("Error occured while trying to mark as read");
		console.log(error, error.stack);
		res.status(500).json({
			ok: false,
			message: "Sorry this service is down, please try again later",
		});
	}
}

const MessagesController = {
	sendMessage: sendMessage,
	getConversation: getConversation,
	getInbox: getInbox,
	markAsRead: markAsRead,
};

module.exports = MessagesController;
