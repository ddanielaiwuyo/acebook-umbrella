import { useNavigate } from "react-router-dom";
import "./ConversationPreview.css";
export function ConversationPreview(props) {
	const navigate = useNavigate();

	function handleClick() {
		if (props.onMarkRead) {
			props.onMarkRead(props.otherUserId);
		}
		navigate(`/messages/${props.otherUserId}`);
	}
	return (
		<div
			onClick={handleClick}
			className={`conversation-preview ${props.isRead === false ? "unread" : ""}`}>
			<div className="otheruser-info">
				<img
					src={props.otherUserImg}
					alt={`Profile picture of ${props.otherUserName}`}
					className="otheruser-img"
				/>
				<div className="otheruser-text">
					<p className="otheruser-name">{props.otherUserName}</p>
					<p className="otheruser-last-message">{props.content}</p>
				</div>
			</div>
			<div>{props.isRead === false && <div className="unread-dot"></div>}</div>
		</div>
	);
}
