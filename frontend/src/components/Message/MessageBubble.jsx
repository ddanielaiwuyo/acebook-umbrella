import "./MessageBubble.css";

export function MessageBubble(props) {
	return (
		<div
			className={props.isMe ? "bubble-me-container" : "bubble-them-container"}>
			<div className={props.isMe ? "bubble-me" : "bubble-them"}>
				<p className="content">{props.content}</p>
			</div>
			<span className="date">{props.date}</span>
		</div>
	);
}
