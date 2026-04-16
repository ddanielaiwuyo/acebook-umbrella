import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import "@testing-library/jest-dom"; //requires installation (npm install @testing-library/jest-dom)
import { LoginPage } from "../../src/pages/Login/LoginPage";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

// Mock router
vi.mock("react-router-dom", () => ({
	useNavigate: () => mockNavigate,
	useLocation: () => ({ state: {} }),
	Link: ({ children }) => children, // simple mock
}));

// Mock auth service
vi.mock("../../src/services/authentication", () => ({
	login: (...args) => mockLogin(...args),
}));


// To prevent stderr messages from application obscuring test results
beforeEach(() => {
	vi.spyOn(console, 'error').mockImplementation(() => { })
})

afterEach(() => {
	vi.restoreAllMocks()
})



// Helper
async function completeLoginForm() {
	const user = userEvent.setup();

	const inputs = screen.getAllByRole("textbox");

	await user.type(inputs[0], "test@email.com");
	await user.type(screen.getByPlaceholderText(/password/i), "1234");

	await user.click(screen.getByRole("button", { name: /log in/i }));
}

describe("Login Page", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// mock localStorage
		global.localStorage = {
			setItem: vi.fn(),
		};
	});

	test("allows a user to login", async () => {
		mockLogin.mockResolvedValue({
			token: "abc",
			message: "Success",
			status: 200,
		});

		render(<LoginPage />);

		await completeLoginForm();

		expect(mockLogin).toHaveBeenCalledWith("test@email.com", "1234");
	});

	test("navigates to /feed on successful login", async () => {
		mockLogin.mockResolvedValue({
			token: "abc",
			message: "Success",
			status: 200,
		});

		render(<LoginPage />);

		await completeLoginForm();

		expect(mockNavigate).toHaveBeenCalledWith("/feed", {
			replace: true,
		});
	});

	test("shows error if status is not 200", async () => {
		mockLogin.mockResolvedValue({
			token: null,
			message: "Invalid credentials",
			status: 401,
		});

		render(<LoginPage />);

		await completeLoginForm();

		expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
	});

	test("navigates to /login on error", async () => {
		mockLogin.mockRejectedValue(new Error("fail"));

		render(<LoginPage />);

		await completeLoginForm();

		expect(mockNavigate).toHaveBeenCalledWith("/login");
	});
});
