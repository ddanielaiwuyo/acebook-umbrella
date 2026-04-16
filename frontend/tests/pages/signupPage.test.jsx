import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";
import { signup } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

//mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
	useNavigate: () => mockNavigate,
	Link: ({ children }) => children,
}));

// mock signup service
vi.mock("../../src/services/authentication", () => ({
	signup: vi.fn(),
}));

// To prevent stderr messages from application obscuring test results
beforeEach(() => {
	vi.spyOn(console, 'error').mockImplementation(() => { })
})

afterEach(() => {
	vi.restoreAllMocks()
})
async function completeSignupForm() {
	const user = userEvent.setup();

	const firstName = await screen.findByPlaceholderText(/first name/i);
	const surname = await screen.findByPlaceholderText(/surname/i);
	const email = await screen.findByPlaceholderText(/email/i);
	const password = await screen.findByPlaceholderText(/password/i);

	const button = screen.getByRole("button", { name: /sign up/i });

	await user.type(firstName, "John");
	await user.type(surname, "Doe");
	await user.type(email, "test@email.com");
	await user.type(password, "1234");
	await user.click(button);
}

describe("Signup Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("allows a user to signup", async () => {
		signup.mockResolvedValue({ status: 201 });

		render(<SignupPage />);

		await completeSignupForm();

		expect(signup).toHaveBeenCalledWith({
			firstName: "John",
			lastName: "Doe",
			email: "test@email.com",
			password: "1234",
		});
	});

	test("navigates to /login on successful signup", async () => {
		signup.mockResolvedValue({ status: 201 });

		render(<SignupPage />);

		await completeSignupForm();

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/login", expect.any(Object));
		});
	});

	test("navigates to /signup on unsuccessful signup", async () => {
		signup.mockRejectedValue(new Error("Error signing up"));

		render(<SignupPage />);

		await completeSignupForm();

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith("/signup");
		});
	});
});
