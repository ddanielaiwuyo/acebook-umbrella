import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import Feed from "../../components/Feed/Feed";
import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
        .then((data) => {
          console.log("all posts from server:", data);
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
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

  console.log("Feed Page");
  return (
    <>
      <h2>Latest Posts</h2>
      <Feed posts={posts} />
    </>
  );
  // return (
  //   <>
  //     <h2>Posts</h2>
  //     <div className="feed" role="feed">
  //       {posts.map((post) => (
  //         <Post post={post} key={post._id} />
  //       ))}
  //     </div>
  //     <LogoutButton />
  //   </>
  // );
}
