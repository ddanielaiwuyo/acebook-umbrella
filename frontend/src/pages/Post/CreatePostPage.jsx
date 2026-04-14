import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CreatePostPage.css";

export function CreatePostPage() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("POST BUTTON CLICKED"); //TEMP

    if (!content) return;

    const token = localStorage.getItem("token");
    // console.log("TOKEN:", token); //TEMP

    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "New Post",
        content,
      }),
    });
    console.log("RESPONSE:", response); //TEMP
    if (response.ok) {
      navigate("/feed");
    } // Need to add error capture
  };

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
        <button onClick={handleSubmit} disabled={!content.trim()}>
          Post
        </button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}
