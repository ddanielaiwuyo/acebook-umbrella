import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { FeedPage } from "../../src/pages/Feed/FeedPage.jsx";
import Feed from "../../src/components/Feed/Feed.jsx"
import { getPosts } from "../../src/services/posts";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
	const getPostsMock = vi.fn();
	return { getPosts: getPostsMock };
});

// Mocking React Router's useNavigate and useLocation functions
vi.mock("react-router-dom", () => {
	const navigateMock = vi.fn();
	const useNavigateMock = () => navigateMock;
	const useLocationMock = () => ({ pathname: "/feed" });
	return { 
		useNavigate: useNavigateMock,
		useLocation: useLocationMock
	};
});

describe("Feed Page", () => {
	beforeEach(() => {
		window.localStorage.removeItem("token");
	});
	test("It displays posts from the backend", async () => {
		window.localStorage.setItem("token", "testToken");
		const mockPosts = [{
			_id: "12345",
			owner: { firstName: "Test", lastName: "User" },
			content: "Test Post 1",
			title: "Test Title",
			createdAt: new Date(),
			likeCount: 1,
			comments: [],
		}];
		getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
		render(<Feed posts={mockPosts} />);
		expect(screen.getByText(/Test Post 1/i)).toBeInTheDocument()
		expect(screen.getByText(/Test User/i)).toBeInTheDocument()
	});
	test("It navigates to login if no token is present", async () => {
		render(<FeedPage />);
		const navigateMock = useNavigate();
		expect(navigateMock).toHaveBeenCalledWith("/login");
	});
});

const TEST_POSTS = [{
	_id: "12345",
	owner: { firstName: "Test", lastName: "User" },
	content: "Test Post ",
	title: "Test Title",
	createdAt: new Date(),
	likeCount: 0,
	comments: [
		{
			id: "abc_comment",
			owner: { firstName: "Test", lastName: "Comment" },
			message: "This is my own private domicile!"
		}
	],
}]

describe("UI Interactions", () => {
	test("like counts increase by 1 when like button is clicked", async () => {
		render(<Feed posts={TEST_POSTS} />)
		const likeBtn = screen.getByTestId("like-button");
		fireEvent.click(likeBtn)
		expect(likeBtn).toHaveTextContent("1");
		fireEvent.click(likeBtn)
		expect(likeBtn).toHaveTextContent("0");
	})
	test("comment section shows up when comment button is clicked", () => {
		render(<Feed posts={TEST_POSTS} />)
		const commentBtn = screen.getByTestId("comment-btn")
		const commentSection = screen.getByTestId("comment-section")
		fireEvent.click(commentBtn)
		expect(commentSection).toHaveTextContent("This is my own private domicile")
	})
})
