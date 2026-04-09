import { useState } from "react";
import "./Feed.css";

function LikeButton(props) {
  let { likeCount } = props;
  const [liked, toggle] = useState(false);
  const [likes, updateLikes] = useState(likeCount);

  const handleClick = () => {
    if (!liked) {
      toggle(true);
      likeCount += 1;
      updateLikes(likeCount);
    } else {
      toggle(false);
      updateLikes(likeCount);
    }
  };

  // The like button could be an svg or icon
  return (
    <>
      <div>
        <button className="like-button post-likes-icon" onClick={handleClick}>
          Likes {likes}
        </button>
      </div>
    </>
  );
}

// The comment section acts as a bottom-sheet, it slides from the bottom
// of the screen and renders all the comments for a particular post.
// By default the panel is hidden/closed and has a html-class of 'comments-panel'
// When the user wants to see all the comments for a post, the class is switched to 'comments-panel open'
// Other ways like creating a new page, or a dropdown affected UX or layout, in the way that I did it.
// This is just a test version to get something working and when a final design is ready, this can be scrapped away
function CommentSection(props) {
  const { comments } = props;
  const [showComments, setShowComments] = useState(false);

  let showPanelClass = "comments-panel";
  const toggleCommentSection = () => {
    if (!showComments) {
      setShowComments(true);
    } else {
      setShowComments(false);
    }
  };

  if (showComments) {
    showPanelClass = "comments-panel open";
  }

  return (
    <>
      <div
        className="post-likes-icon comments-icon"
        onClick={toggleCommentSection}
      >
        {" "}
        Comments{" "}
      </div>
      <div className={showPanelClass}>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p className="comment-owner">{comment.owner.name}</p>
            <p className="comment-message">{comment.message}</p>
          </div>
        ))}
        <button onClick={toggleCommentSection}>Close</button>
      </div>
    </>
  );
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
          <CommentSection comments={comments} />
        </div>
      </div>
    </>
  );
}
/**
 * Takes all posts from the database and renders them
 * using PostCard Component
 * */
function Feed(props) {
  const { posts } = props;
  console.log(posts);
  return (
    <>
      <div className="feed-container">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </>
  );
}

export default Feed;
