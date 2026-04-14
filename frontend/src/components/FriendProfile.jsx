import "./FriendProfile.css";

export function FriendProfile(props) {
	return (
		<div className="profile">
			<div className="profile-info">
				<img
					src={props.profileImg}
					alt={`Profile picture of ${props.profileName}`}
					className="profileimg"
				/>
				<p className="profilename">{props.profileName}</p>
			</div>
			{props.children}
		</div>
	);
}
