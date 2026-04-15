import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { MessageProfile } from "../../components/Message/MessageProfile";
import { MessageBubble } from "../../components/Message/MessageBubble";
import { sendMessage, getConversation } from "../../services/messages";
import { FaPaperPlane } from "react-icons/fa";
import { formatTime, formatSeperator } from "../../helper/dateHelper";

import "./ConversationPage.css";

export function ConversationPage() {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState([]);
	const [otherUserInfo, setOtherUserInfo] = useState(null);
	const [userId, setUserId] = useState(null);
	let params = useParams();
	const otherId = params.id;
	const bottomRef = useRef(null);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [messages]);
	useEffect(() => {
		const token = localStorage.getItem("token");
		const loggedIn = token !== null;
		if (!token || !otherId) return;
		const payload = JSON.parse(atob(token.split(".")[1]));
		setUserId(payload.sub);
		if (loggedIn) {
			getConversation(otherId).then((data) => {
				if (data.ok) {
					setMessages(data.messages);
					setOtherUserInfo(data.otherUser);
				} else {
					setErrorMessage(data.message);
				}
			});
		}
	}, [otherId]);

	function handleSend() {
		if (!newMessage.trim()) return;
		sendMessage(otherId, newMessage).then((data) => {
			if (data.ok) {
				setMessages((prev) => [...prev, data.newMessage]);
				setNewMessage("");
			} else {
				setErrorMessage(data.message);
			}
		});
	}

	return (
		<div className="conversation-page">
			<MessageProfile
				otherUserImg={`https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUserInfo?._id}&size=60`}
				otherUserName={`${otherUserInfo?.firstName} ${otherUserInfo?.lastName}`}
			/>
			<div className="messages-container">
				{messages?.map((msg, index) => {
					const currentDate = new Date(msg.createdAt).toDateString();
					const prevDate =
						index > 0
							? new Date(messages[index - 1].createdAt).toDateString()
							: null;
					const showSeperator = currentDate !== prevDate;
					return (
						<React.Fragment key={msg._id}>
							{showSeperator && (
								<div className="date-seperator">
									<span>{formatSeperator(msg.createdAt)}</span>
								</div>
							)}
							<MessageBubble
								key={msg._id}
								content={msg.content}
								isMe={msg.sender?._id?.toString() === userId?.toString()}
								date={formatTime(msg.createdAt)}
							/>
						</React.Fragment>
					);
				})}
				<div ref={bottomRef} />
			</div>
			<div className="message-input">
				<input
					type="text"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					placeholder="Type a message..."
				/>
				<button type="submit" onClick={handleSend}>
					<FaPaperPlane size={16} />
				</button>
			</div>
		</div>
	);
}
