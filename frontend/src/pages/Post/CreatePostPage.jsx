import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CreatePostPage.css";

export function CreatePostPage() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!content) return;

  await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title: "New Post",
      content,
    }),
  });

  const handleCancel = () => {
    navigate("/feed");
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">
        <h2>Create your post</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share what's on your mind"
        />
        <button onClick={handleSubmit}>Post</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}
