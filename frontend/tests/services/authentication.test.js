import createFetchMock from "vitest-fetch-mock";
import { describe, vi } from "vitest";

import { login, signup } from "../../src/services/authentication";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("authentication service", () => {
	describe("login", () => {
		test("calls the backend url for a token", async () => {
			const testEmail = "test@testEmail.com";
			const testPassword = "12345678";

			fetch.mockResponseOnce(JSON.stringify({ message: "OK", token: "testToken" }), {
				status: 201,
			});

			await login(testEmail, testPassword);

			// This is an array of the arguments that were last passed to fetch
			const fetchArguments = fetch.mock.lastCall;
			const url = fetchArguments[0];
			const options = fetchArguments[1];

			expect(url).toEqual(`${BACKEND_URL}/tokens`);
			expect(options.method).toEqual("POST");
			expect(options.body).toEqual(
				JSON.stringify({ email: testEmail, password: testPassword }),
			);
			expect(options.headers["Content-Type"]).toEqual("application/json");
		});

		test("returns the token if the request was a success", async () => {
			const testEmail = "test@testEmail.com";
			const testPassword = "12345678";

			fetch.mockResponseOnce(JSON.stringify({ message: "OK", token: "testToken" }), {
				status: 201,
			});

			const response = await login(testEmail, testPassword);
			expect(response.token).toEqual("testToken");
		});

		// When a user signups successfully, no data is sent  back to them
		// Only a message in the response body that says `Created Successfully`
		describe("signup", () => {
			test("calls the backend url for a token", async () => {
				const testEmail = "test@testEmail.com";
				const testPassword = "12345678";
				const payload = {
					firstName: "Test",
					lastName: "User",
					email: testEmail,
					password: testPassword,
				}

				fetch.mockResponseOnce(JSON.stringify(""), {
					status: 201,
					message: "Created Successfully",
				});

				await signup(payload);

				// This is an array of the arguments that were last passed to fetch
				const fetchArguments = fetch.mock.lastCall;
				const url = fetchArguments[0];
				const options = fetchArguments[1];


				expect(url).toEqual(`${BACKEND_URL}/users`);
				expect(options.method).toEqual("POST");
				expect(JSON.parse(options.body)).toEqual(payload);
				expect(options.headers["Content-Type"]).toEqual("application/json");
			});

			test("returns nothing if the signup request was a success", async () => {
				const testEmail = "test@testEmail.com";
				const testPassword = "12345678";

				const payload = {
					firstName: "Test",
					lastName: "User",
					email: testEmail,
					password: testPassword,
				}

				fetch.mockResponseOnce(JSON.stringify(""), {
					status: 201,
					message: "Created Successfully",
				});

				const response = await signup(payload);
				expect(response.status).toEqual(201)
				console.log(response)
				expect(response.token).toEqual(undefined);
			});

			test("throws an error if the request failed", async () => {
				const testEmail = "test@testEmail.com";
				const testPassword = "12345678";

				fetch.mockResponseOnce(
					JSON.stringify({ message: "User already exists" }),
					{
						status: 400,
					},
				);

				try {
					await signup(testEmail, testPassword);
				} catch (err) {
					expect(err.message).toEqual(
						"Received status 400 when signing up. Expected 201",
					);
				}
			})
		});
	});
});
