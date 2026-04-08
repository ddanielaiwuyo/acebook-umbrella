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

function CommentSection(props) {
	return (
		<>
			<div className="comment-section">
				<p>Comments will be displayed here</p>
			</div>
		</>
	);
}

function PostCard(props) {
	// TODO: Need to find a way for use to toggle comment section
	const { owner, message, likeCounts, createdAt, comments } = props.post;
	let datePosted = new Date(createdAt).toDateString();
	return (
		<>
			<div className="post-card-container">
				<div className="post-title">{owner} </div>
				<div className="post-content">{message}</div>
				<div className="post-icon-container">
					<div className="post-likes-icon">Likes: {likeCounts} </div>
					<div className="post-likes-icon">{datePosted} </div>
					<div className="post-likes-icon comments-icon">Comments</div>
				</div>
			</div>
		</>
	);
}
export default Feed;
