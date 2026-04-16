const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/user");
const Message = require("../../models/message");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
	return JWT.sign(
		{
			sub: userId,
			// Backdate this token of 5 minutes
			iat: Math.floor(Date.now() / 1000) - 5 * 60,
			// Set the JWT token to expire in 10 minutes
			exp: Math.floor(Date.now() / 1000) + 10 * 60,
		},
		secret,
	);
}

let token1;
let token2;
let user1;
let user2;

describe("/messages", () => {
	beforeAll(async () => {
		user1 = new User({
			firstName: "FirstName1",
			lastName: "LastName1",
			email: "message-test1@test.com",
			password: "12345678",
		});

		user2 = new User({
			firstName: "FirstName2",
			lastName: "LastName2",
			email: "message-test2@test.com",
			password: "12345678",
		});

		await user1.save();
		await user2.save();
		token1 = createToken(user1.id);
		token2 = createToken(user2.id);
	});

	afterEach(async () => {
		await Message.deleteMany({});
		await User.deleteMany({});

		user1 = new User({
			firstName: "FirstName1",
			lastName: "LastName1",
			email: "message-test1@test.com",
			password: "12345678",
		});

		user2 = new User({
			firstName: "FirstName2",
			lastName: "LastName2",
			email: "message-test2@test.com",
			password: "12345678",
		});

		await user1.save();
		await user2.save();
		token1 = createToken(user1.id);
		token2 = createToken(user2.id);
	});

	afterAll(async () => {
		await User.deleteMany({});
		await Message.deleteMany({});
	});

	// ---- SEND MESSAGE ----
	describe("POST /:id (sendMessage)", () => {
		test("responds with 201 and success message", async () => {
			const response = await request(app)
				.post(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`)
				.send({ content: "Hey user2!" });

			expect(response.status).toEqual(201);
			expect(response.body.ok).toBe(true);
			expect(response.body.message).toEqual("Message sent");
		});

		test("saves the message to the database with correct sender and receiver", async () => {
			await request(app)
				.post(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`)
				.send({ content: "Hello!" });

			const messages = await Message.find({});
			expect(messages).toHaveLength(1);
			expect(messages[0].sender.toString()).toEqual(user1.id);
			expect(messages[0].receiver.toString()).toEqual(user2.id);
			expect(messages[0].content).toEqual("Hello!");
		});

		test("message defaults to isRead false", async () => {
			await request(app)
				.post(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`)
				.send({ content: "Hello!" });

			const messages = await Message.find({});
			expect(messages[0].isRead).toEqual(false);
		});

		test("responds with 500 if content is missing", async () => {
			const response = await request(app)
				.post(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`)
				.send({});

			expect(response.status).toEqual(500);
			expect(response.body.ok).toBe(false);
		});
	});

	// ---- GET CONVERSATION ----
	describe("GET /:id (getConversation)", () => {
		test("responds with 200 and success", async () => {
			const response = await request(app)
				.get(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`);

			expect(response.status).toEqual(200);
			expect(response.body.ok).toBe(true);
		});

		test("returns empty array when no messages between users", async () => {
			const response = await request(app)
				.get(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`);

			expect(response.body.messages).toHaveLength(0);
			expect(response.body.messages).toEqual([]);
		});

		test("returns messages between two users in both directions", async () => {
			// user1 sends to user2
			await request(app)
				.post(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`)
				.send({ content: "Hey!" });

			// user2 replies to user1
			await request(app)
				.post(`/messages/${user1.id}`)
				.set("Authorization", `Bearer ${token2}`)
				.send({ content: "Hey back!" });

			const response = await request(app)
				.get(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`);

			expect(response.body.messages).toHaveLength(2);
		});

		test("does not return messages from other conversations", async () => {
			// user1 messages user2
			await request(app)
				.post(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`)
				.send({ content: "Private message" });

			// user2 fetches conversation with user1 — should only see their own convo
			const response = await request(app)
				.get(`/messages/${user1.id}`)
				.set("Authorization", `Bearer ${token2}`);

			expect(response.body.messages).toHaveLength(1);
		});
	});

	// ---- GET INBOX ----
	describe("GET / (getInbox)", () => {
		test("responds with 200 and success", async () => {
			const response = await request(app)
				.get("/messages/inbox")
				.set("Authorization", `Bearer ${token1}`);

			expect(response.status).toEqual(200);
			expect(response.body.ok).toBe(true);
		});

		test("returns empty inbox when user has no messages", async () => {
			const response = await request(app)
				.get("/messages/inbox")
				.set("Authorization", `Bearer ${token1}`);

			expect(response.body.messages).toHaveLength(0);
		});

		test("returns one conversation per user (deduped)", async () => {
			// user2 sends two messages to user1
			await request(app)
				.post(`/messages/${user1.id}`)
				.set("Authorization", `Bearer ${token2}`)
				.send({ content: "First message" });

			await request(app)
				.post(`/messages/${user1.id}`)
				.set("Authorization", `Bearer ${token2}`)
				.send({ content: "Second message" });

			const response = await request(app)
				.get("/messages/inbox")
				.set("Authorization", `Bearer ${token1}`);

			// Inbox dedupes by conversation partner
			expect(response.body.messages).toHaveLength(1);
		});
	});

	// ---- MARK AS READ ----
	describe("PATCH /:id/read (markAsRead)", () => {
		test("responds with 200 and ok true", async () => {
			await request(app)
				.post(`/messages/${user1.id}`)
				.set("Authorization", `Bearer ${token2}`)
				.send({ content: "Read me!" });

			const response = await request(app)
				.patch(`/messages/${user2.id}/read`)
				.set("Authorization", `Bearer ${token1}`);

			expect(response.status).toEqual(200);
			expect(response.body.ok).toBe(true);
		});

		test("marks messages from a user as read", async () => {
			// user2 sends message to user1
			await request(app)
				.post(`/messages/${user1.id}`)
				.set("Authorization", `Bearer ${token2}`)
				.send({ content: "Read me!" });

			// user1 marks as read
			await request(app)
				.patch(`/messages/${user2.id}/read`)
				.set("Authorization", `Bearer ${token1}`);

			const messages = await Message.find({
				sender: user2.id,
				receiver: user1.id,
			});

			expect(messages[0].isRead).toEqual(true);
		});

		test("does not mark messages sent by the user as read", async () => {
			// user1 sends to user2
			await request(app)
				.post(`/messages/${user2.id}`)
				.set("Authorization", `Bearer ${token1}`)
				.send({ content: "My own message" });

			// user1 marks user2's messages as read (there are none)
			await request(app)
				.patch(`/messages/${user2.id}/read`)
				.set("Authorization", `Bearer ${token1}`);

			const messages = await Message.find({
				sender: user1.id,
				receiver: user2.id,
			});

			// user1's own sent messages should remain unread
			expect(messages[0].isRead).toEqual(false);
		});
	});
});
