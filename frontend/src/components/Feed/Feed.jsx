import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { MdOutlineAddCircle } from "react-icons/md";
import "./Feed.css";
import { createComment } from "../../services/posts";

function MetaInfo({ firstName, lastName, profilePic }) {
  return (
    <>
      <div className="meta">
        <img src={profilePic} className="profile-picture" />
        <p className="post-title">
          {firstName} {lastName}
        </p>
      </div>
    </>
  );
}

function PopUp() {
  return (
    <>
      <div className="pop-up-container">
        <IoChatbubbleEllipsesSharp style={{ width: 40, height: 40 }} />
        <div className="prompt">Whats on your mind?</div>
        <span className="add-post-icon">
          <a href="/post">
            {" "}
            <MdOutlineAddCircle style={{ width: 30, height: 30 }} />{" "}
          </a>
        </span>
      </div>
    </>
  );
}

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
          {liked ? (
            <FaHeart color="red" style={{ width: 20, height: 20 }} />
          ) : (
            <FaRegHeart style={{ width: 20, height: 20 }} />
          )}
          <span className="like-count"> {likes} </span>
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
  const { comments, post_id } = props;
  const [showComments, setShowComments] = useState(false);
  // <<<<<<< HEAD
  // state for the input
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCommentSection = () => setShowComments(!showComments);

  // submitting a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data = await createComment(token, post_id, newComment);
      comments.push(data.comment);
      localStorage.setItem("token", data.token);

      setNewComment("");
    } catch (err) {
      alert("Error posting comment: " + err.message);
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  let showPanelClass = showComments ? "comments-panel open" : "comments-panel";

  return (
    <>
      <div
        className="post-likes-icon comments-icon"
        onClick={toggleCommentSection}
      >
        Comments ({comments.length})
      </div>

      <div className={showPanelClass}>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p className="comment-owner">
              {/* To avoid React from breaking when a new comment is made */}
              {comment.owner?.firstName ?? ""} {comment.owner?.lastName ?? ""}
            </p>
            <p className="comment-message">{comment.message}</p>
          </div>
        ))}

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

        <button onClick={toggleCommentSection} className="close-panel-btn">
          Close
        </button>
      </div>
    </>
  );
}

const AVATAR_URL = "https://api.dicebear.com/7.x/adventurer/svg?";

function PostCard(props) {
  const { owner, content, likeCount, createdAt, comments } = props.post;
  const post_id = props.post._id;
  let datePosted = new Date(createdAt).toDateString();
  // <div className="post-content">
  // 	<img src={`${avatar_url}?seed=${owner.name}`} alt={owner.name} />
  // </div>
  return (
    <>
      <div className="post-card-container">
        <div>
          <MetaInfo
            firstName={owner.firstName}
            lastName={owner.lastName}
            profilePic={`${AVATAR_URL}seed=${owner.firstName}&size=45`}
          />
        </div>
        <div className="post-content">{content}</div>

        <div className="post-icon-container">
          <div className="post-likes-icon">
            <LikeButton likeCount={likeCount} />
          </div>
          <div className="post-likes-icon">{datePosted} </div>
          <CommentSection comments={comments} post_id={post_id} />
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
        <PopUp />
        {posts.map((post) => (
          <PostCard key={post._id} post={post} post_id={post._id} />
        ))}
      </div>
    </>
  );
}

export default Feed;
