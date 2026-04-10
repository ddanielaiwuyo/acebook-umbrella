import { addFriend } from "../services/friends";

export function AddButton(props) {
	async function handleClick() {
		await addFriend(props.userId)
		props.onAdd(props.userId)
	}

	return (
		<div>
			<button onClick={handleClick}>Add Friend</button>
		</div>
	);
}
