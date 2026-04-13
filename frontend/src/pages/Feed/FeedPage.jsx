import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import Feed from "../../components/Feed/Feed";
import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
          console.log(data);
          if (data.ok) {
            setPosts(data.posts);
            setError("");
          } else {
            setError(data.message);
          }
          // localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  if (error.trim().length > 5) {
    return <h2 className="error">{error}</h2>;
  }
  return (
    <>
      <h2>Latest Posts</h2>
      <p className="error">{error}</p>
      <Feed posts={posts} />
    </>
  );
}
