require("../mongodb_helper");
const User = require("../../models/user");
const Message = require("../../models/message");

describe("Message model", () => {
	let sender, receiver;

	beforeEach(async () => {
		await Message.deleteMany({});
		await User.deleteMany({});

		sender = new User({ email: "sender@example.com", password: "password" });
		receiver = new User({
			email: "receiver@example.com",
			password: "password",
		});

		await sender.save();
		await receiver.save();
	});

	it("has a sender", () => {
		const message = new Message({
			sender: sender._id,
			receiver: receiver._id,
			content: "Hello!",
		});
		expect(message.sender).toEqual(sender._id);
	});

	it("has a receiver", () => {
		const message = new Message({
			sender: sender._id,
			receiver: receiver._id,
			content: "Hello!",
		});
		expect(message.receiver).toEqual(receiver._id);
	});

	it("has content", () => {
		const message = new Message({
			sender: sender._id,
			receiver: receiver._id,
			content: "Hello!",
		});
		expect(message.content).toEqual("Hello!");
	});

	it("defaults isRead to false", () => {
		const message = new Message({
			sender: sender._id,
			receiver: receiver._id,
			content: "Hello!",
		});
		expect(message.isRead).toEqual(false);
	});

	it("has a createdAt date", () => {
		const message = new Message({
			sender: sender._id,
			receiver: receiver._id,
			content: "Hello!",
		});
		expect(message.createdAt).toBeDefined();
	});

	it("can list all messages", async () => {
		const messages = await Message.find();
		expect(messages).toEqual([]);
	});

	it("can save a message", async () => {
		const message = new Message({
			sender: sender._id,
			receiver: receiver._id,
			content: "Hello!",
		});

		await message.save();
		const messages = await Message.find();

		expect(messages[0].content).toEqual("Hello!");
		expect(messages[0].isRead).toEqual(false);
	});

	it("can mark a message as read", async () => {
		const message = new Message({
			sender: sender._id,
			receiver: receiver._id,
			content: "Hello!",
		});

		await message.save();
		await Message.findByIdAndUpdate(message._id, { isRead: true });
		const updated = await Message.findById(message._id);

		expect(updated.isRead).toEqual(true);
	});
});
