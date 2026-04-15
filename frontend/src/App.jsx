import {
	createBrowserRouter,
	RouterProvider,
	Routes,
	Route,
} from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { FriendsPage } from "./pages/Friends/FriendsPage";
import { ConversationPage } from "./pages/Messages/ConversationPage";
import { InboxPage } from "./pages/Messages/InboxPage";

import NavBar from "./components/NavBar/NavBar";
import Layout from "./components/NavBar/Layout";

// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<Layout>
				<HomePage />
			</Layout>
		),
	},
	{
		path: "/login",
		element: (
			<Layout>
				<LoginPage />
			</Layout>
		),
	},
	{
		path: "/signup",
		element: (
			<Layout>
				<SignupPage />
			</Layout>
		),
	},
	{
		path: "/feed",
		element: (
			<Layout>
				<FeedPage />
			</Layout>
		),
	},
	{
		path: "/profile/:profile_id",
		element: (
			<Layout>
				<ProfilePage />
			</Layout>
		),
	},
	{
		path: "/profile",
		element: (
			<Layout>
				<ProfilePage />
			</Layout>
		),
	},
	{
		path: "/friends",
		element: (
			<Layout>
				<FriendsPage />
			</Layout>
		),
	},
	{
		path: "/messages",
		element: (
			<Layout>
				<InboxPage />
			</Layout>
		),
	},
	{
		path: "/messages/:id",
		element: (
			<Layout>
				<ConversationPage />
			</Layout>
		),
	},
]);

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
