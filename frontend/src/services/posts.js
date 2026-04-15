// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/feed`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}

export async function createComment(token, post_id, message) {
  const requestOptions ={
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_id: post_id,
      message: message
    }),
  };
console.log("I am here", token);
  const response = await fetch(`${BACKEND_URL}/posts/comments`, requestOptions);

  if (response.status !== 201) {
    console.log(response.body);
    throw new Error("Unable to create comment");
  }

  const data = await response.json();
  return data
}