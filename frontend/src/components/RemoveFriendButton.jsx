import { removeFriend } from "../services/friends";

export function RemoveButton(props) {
    async function handleClick() {
        await removeFriend(props.userId);
        props.onRemove(props.userId);
    }

    return (
        <div>
            <button onClick={handleClick}>Remove Friend</button>
        </div>
    );
}
