import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import Feed from "../../components/Feed/Feed";
import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
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


  useEffect(() => {
    if (location.state?.highlightPostId && posts.length > 0) {
        setTimeout(() => {
            const postElement = document.getElementById(location.state.highlightPostId);
            if (postElement) {
                postElement.scrollIntoView({ behavior: "smooth", block: "center" });
                postElement.classList.add("highlighted-post");
                setTimeout(() => postElement.classList.remove("highlighted-post"), 3000);
            } else {
                console.log("Post element not found, ID:", location.state.highlightPostId);
            }
        }, 100);
    }
}, [location.state, posts]);


  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  if (error && error.length > 5) {
    return <h2 className="error">{error}</h2>;
  }
  return (
    <>
      <h2>Latest Posts</h2>
      <p className="error">{error}</p>
      <Feed posts={posts}  />
    </>
  );
}
