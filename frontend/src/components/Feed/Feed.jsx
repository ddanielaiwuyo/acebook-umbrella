import { useState } from "react";
import "./Feed.css";
import { createComment } from "../../services/posts";

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
  const { comments, post_id, token } = props;
  const [showComments, setShowComments] = useState(false);
  
  // state for the input
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCommentSection = () => setShowComments(!showComments);

  // handles submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const data = await createComment(token, post_id, newComment);
      console.log("Comment added:", data);
      
      setNewComment("");
      alert("Comment posted!"); 
      
    } catch (err) {
      alert("Error posting comment: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  let showPanelClass = showComments ? "comments-panel open" : "comments-panel";

  return (
    <>
      <div className="post-likes-icon comments-icon" onClick={toggleCommentSection}>
        Comments ({comments.length})
      </div>
      
      <div className={showPanelClass}>
        {/* this makes the comments a scrollable list of comments */}
        <div className="comments-list">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <p className="comment-owner">{comment.owner.name}</p>
              <p className="comment-message">{comment.message}</p>
            </div>
          ))}
        </div>

        {/* the form for writing a new comment */}
        <form onSubmit={handleCommentSubmit} className="comment-input-form">
          <input 
            type="text" 
            placeholder="Write a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? "..." : "Post"}
          </button>
        </form>

        <button onClick={toggleCommentSection} className="close-panel-btn">Close</button>
      </div>
    </>
  );
}

function PostCard(props) {
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
