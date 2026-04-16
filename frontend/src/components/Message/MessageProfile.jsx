import "./MessageProfile.css"

export function MessageProfile(props) {
	return (
		<div className="otheruser-info-profile">
			<img
				src={props.otherUserImg}
				alt={`Profile picture of ${props.otherUserName}`}
				className="otheruser-img-profile"
			/>
			<p className="otheruser-name-profile">{props.otherUserName}</p>
		</div>
	);
}
