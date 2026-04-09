import { acceptFriendRequest, deleteFriendRequest } from "../services/friends";

export function RequestButtons(props) {
	async function handleAcceptButtonClick() {
		await acceptFriendRequest(props.senderId);
		props.onAction(props.senderId, "accept");
	}

	async function handleDeleteButtonClick() {
		await deleteFriendRequest(props.senderId);
		props.onAction(props.senderId, "delete");
	}

	return (
		<div>
			<button onClick={handleAcceptButtonClick}>Accept</button>
			<button onClick={handleDeleteButtonClick}>Delete</button>
		</div>
	);
}
