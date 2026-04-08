export function FriendProfile(props) {
	return (
		<div className="profile">
			<img src={props.profileImg} alt={`Profile picture of ${props.profileName}`} />
            <p>{props.profileName}</p>
            {props.children}
		</div>
	);
}
