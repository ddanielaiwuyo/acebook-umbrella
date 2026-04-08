import { useState } from "react";
import "./Feed.css";
/**
 * Takes all posts from the database and renders them
 * using PostCard Component
 * */
function Feed(props) {
	const { posts } = props;
	return (
		<>
			{posts.map((post) => (
				<PostCard key={post._id} post={post} />
			))}
		</>
	);
}

// function CommentSection(props) {
// 	return (
// 		<>
// 			<div className="comment-section">
// 				<p>Comments will be displayed here</p>
// 			</div>
// 		</>
// 	);
// }
//

function LikeButton(props) {
	let { likeCount } = props
	const [liked, toggle] = useState(false)
	const [likes, updateLikes] = useState(likeCount)

	const handleClick = () => {
		if (!liked) {
			toggle(true)
			likeCount += 1;
			updateLikes(likeCount)
		} else {
			toggle(false)
			updateLikes(likeCount)
		}
	}


	// The like button could be an svg or icon
	return (
		<>
			<div>
				<button className="like-button post-likes-icon" onClick={handleClick}>Likes {likes}</button>
			</div >
		</>
	)
}

function PostCard(props) {
	// TODO: Need to find a way for use to toggle comment section
	const { owner, content, likeCount, createdAt, comments } = props.post;
	let datePosted = new Date(createdAt).toDateString();
	return (
		<>
			<div className="post-card-container">
				<div className="post-title">{owner.name} </div>
				<div className="post-content">{content}</div>
				<div className="post-icon-container">
					<div className="post-likes-icon">
						<LikeButton likeCount={likeCount} />
					</div>
					<div className="post-likes-icon">{datePosted} </div>
					<div className="post-likes-icon comments-icon">Comments</div>
				</div>
			</div>
		</>
	);
}
export default Feed;
