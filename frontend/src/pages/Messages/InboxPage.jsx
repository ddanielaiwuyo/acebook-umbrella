import { useState, useEffect } from "react";
import { ConversationPreview } from "../../components/Message/ConversationPreview";
import { getInbox, markAsRead } from "../../services/messages";
import { useNavigate } from "react-router-dom";
import { FaCommentDots } from "react-icons/fa";

import "./InboxPage.css";

export function InboxPage() {
	const [conversations, setConversations] = useState([]);
	const [userId, setUserId] = useState(null);
	const [errorMessage, setErrorMessage] = useState([]);
	const navigate = useNavigate();

	async function handleMarkRead(otherUserId) {
		setConversations((prev) =>
			prev.map((convo) =>
				convo.sender._id.toString() === otherUserId.toString() ||
				convo.receiver._id.toString() === otherUserId.toString()
					? { ...convo, isRead: true }
					: convo,
			),
		);
		await markAsRead(otherUserId);
	}

	useEffect(() => {
		const token = localStorage.getItem("token");
		const loggedIn = token !== null;
		if (loggedIn) {
			const payload = JSON.parse(atob(token.split(".")[1]));
			setUserId(payload.sub);
			getInbox().then((data) => {
				if (data.ok) {
					setConversations(data.messages);
				} else {
					setErrorMessage(data.message);
				}
			});
		}
	}, [navigate]);

	return (
		<div className="inbox-page">
			<h1>Messages</h1>
			{conversations?.map((conversation) => {
				const otherUser =
					conversation.sender._id.toString() === userId?.toString()
						? conversation.receiver
						: conversation.sender;

				const isUnread =
					conversation.receiver._id.toString() === userId?.toString() &&
					conversation.isRead === false;
				return (
					<ConversationPreview
						key={conversation._id}
						otherUserId={otherUser._id}
						otherUserImg={`https://api.dicebear.com/7.x/adventurer/svg?seed=${conversation._id}&size=60`}
						otherUserName={`${otherUser.firstName} ${otherUser.lastName}`}
						content={conversation.content}
						isRead={!isUnread}
						onMarkRead={handleMarkRead}
					/>
				);
			})}
			{conversations?.length === 0 && (
				<div className="inbox-empty">
					<div className="inbox-empty-illustration">
						<FaCommentDots className="inbox-empty-icon" />
						<div className="inbox-empty-bubbles">
							<span className="bubble bubble-1"></span>
							<span className="bubble bubble-2"></span>
							<span className="bubble bubble-3"></span>
						</div>
					</div>
					<p className="inbox-empty-title">No conversations yet</p>
					<p className="inbox-empty-subtitle">
						Start a chat by visiting a friend's profile
					</p>
				</div>
			)}
		</div>
	);
}
