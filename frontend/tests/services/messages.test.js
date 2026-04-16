import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import {
	sendMessage,
	getInbox,
	getConversation,
	markAsRead,
} from "../../src/services/messages";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

global.localStorage = {
	getItem: vi.fn(() => "testToken"),
	setItem: vi.fn(),
	removeItem: vi.fn(),
};

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("messages service", () => {
	// ---- SEND MESSAGE ----
	describe("sendMessage", () => {
		test("includes a token with its request", async () => {
			fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
				status: 201,
			});

			await sendMessage("123", "Hello!");

			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];
			const options = fetchArguments[1];

			expect(url).toEqual(`${BACKEND_URL}/messages/123`);
			expect(options.method).toEqual("POST");
			expect(options.headers["Authorization"]).toEqual("Bearer testToken");
		});

		test("sends request to the correct URL with the userId", async () => {
			fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
				status: 201,
			});

			await sendMessage("456", "Hello!");
			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];

			expect(url).toEqual(`${BACKEND_URL}/messages/456`);
		});

		test("sends the content in the request body", async () => {
			fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
				status: 201,
			});

			await sendMessage("123", "Hello there!");
			const fetchArguments = fetch.mock.lastCall;
			const options = fetchArguments[1];

			expect(options.body).toEqual(JSON.stringify({ content: "Hello there!" }));
		});

		test("returns data on success", async () => {
			fetch.mockResponseOnce(
				JSON.stringify({
					ok: true,
					message: "Message sent",
				}),
				{
					status: 201,
				},
			);

			const response = await sendMessage("123", "Hello!");
			expect(response.ok).toEqual(true);
		});

		test("rejects with an error if the status is not 201", async () => {
			fetch.mockResponseOnce(
				JSON.stringify({ message: "Something went wrong" }),
				{ status: 400 },
			);

			try {
				await sendMessage("123", "Hello!");
			} catch (err) {
				expect(err.message).toEqual("Unable to send message");
			}
		});

		test("returns service down message if fetch throws error", async () => {
			fetch.mockRejectOnce(new Error("Network error"));

			const response = await sendMessage("123", "Hello!");
			expect(response.ok).toEqual(false);
			expect(response.message).toEqual(
				"Service is down please try again later",
			);
		});
	});

	// ---- GET INBOX ----
	describe("getInbox", () => {
		test("includes a token with its request", async () => {
			fetch.mockResponseOnce(JSON.stringify({ messages: [] }), {
				status: 200,
			});

			await getInbox();

			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];
			const options = fetchArguments[1];

			expect(url).toEqual(`${BACKEND_URL}/messages/inbox`);
			expect(options.method).toEqual("GET");
			expect(options.headers["Authorization"]).toEqual("Bearer testToken");
		});

		test("returns data on success", async () => {
			fetch.mockResponseOnce(JSON.stringify({ messages: ["msg1", "msg2"] }), {
				status: 200,
			});

			const response = await getInbox();
			expect(response.messages).toEqual(["msg1", "msg2"]);
		});

		test("rejects with an error if the status is not 200", async () => {
			fetch.mockResponseOnce(
				JSON.stringify({ message: "Something went wrong" }),
				{ status: 400 },
			);

			try {
				await getInbox();
			} catch (err) {
				expect(err.message).toEqual("Unable to get inbox");
			}
		});

		test("returns service down message if fetch throws error", async () => {
			fetch.mockRejectOnce(new Error("Network error"));

			const response = await getInbox();
			expect(response.ok).toEqual(false);
			expect(response.message).toEqual(
				"Service is down please try again later",
			);
		});
	});

	// ---- GET CONVERSATION ----
	describe("getConversation", () => {
		test("includes a token with its request", async () => {
			fetch.mockResponseOnce(JSON.stringify({ messages: [] }), {
				status: 200,
			});

			await getConversation("123");

			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];
			const options = fetchArguments[1];

			expect(url).toEqual(`${BACKEND_URL}/messages/123`);
			expect(options.method).toEqual("GET");
			expect(options.headers["Authorization"]).toEqual("Bearer testToken");
		});

		test("sends request to the correct URL with the userId", async () => {
			fetch.mockResponseOnce(JSON.stringify({ messages: [] }), {
				status: 200,
			});

			await getConversation("456");
			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];

			expect(url).toEqual(`${BACKEND_URL}/messages/456`);
		});

		test("returns data on success", async () => {
			fetch.mockResponseOnce(JSON.stringify({ messages: ["msg1", "msg2"] }), {
				status: 200,
			});

			const response = await getConversation("123");
			expect(response.messages).toEqual(["msg1", "msg2"]);
		});

		test("rejects with an error if the status is not 200", async () => {
			fetch.mockResponseOnce(
				JSON.stringify({ message: "Something went wrong" }),
				{ status: 400 },
			);

			try {
				await getConversation("123");
			} catch (err) {
				expect(err.message).toEqual("Unable to get conversation");
			}
		});

		test("returns service down message if fetch throws error", async () => {
			fetch.mockRejectOnce(new Error("Network error"));

			const response = await getConversation("123");
			expect(response.ok).toEqual(false);
			expect(response.message).toEqual(
				"Service is down please try again later",
			);
		});
	});

	// ---- MARK AS READ ----
	describe("markAsRead", () => {
		test("includes a token with its request", async () => {
			fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
				status: 200,
			});

			await markAsRead("123");

			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];
			const options = fetchArguments[1];

			expect(url).toEqual(`${BACKEND_URL}/messages/123/read`);
			expect(options.method).toEqual("PATCH");
			expect(options.headers["Authorization"]).toEqual("Bearer testToken");
		});

		test("sends request to the correct URL with the userId", async () => {
			fetch.mockResponseOnce(JSON.stringify({ ok: true }), {
				status: 200,
			});

			await markAsRead("456");
			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];

			expect(url).toEqual(`${BACKEND_URL}/messages/456/read`);
		});

		test("returns data on success", async () => {
			fetch.mockResponseOnce(JSON.stringify({ ok: true }), { status: 200 });

			const response = await markAsRead("123");
			expect(response.ok).toEqual(true);
		});

		test("rejects with an error if the status is not 200", async () => {
			fetch.mockResponseOnce(
				JSON.stringify({ message: "Something went wrong" }),
				{ status: 400 },
			);

			try {
				await markAsRead("123");
			} catch (err) {
				expect(err.message).toEqual("Unable to mark as read");
			}
		});

		test("returns service down message if fetch throws error", async () => {
			fetch.mockRejectOnce(new Error("Network error"));

			const response = await markAsRead("123");
			expect(response.ok).toEqual(false);
			expect(response.message).toEqual(
				"Service is down please try again later",
			);
		});
	});
});
