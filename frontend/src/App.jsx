import { createBrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";

import NavBar from "./components/NavBar/NavBar"
import Layout from "./components/NavBar/Layout"

// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: "/login",
    element: <Layout><LoginPage /></Layout>,
  },
  {
    path: "/signup",
    element: <Layout><SignupPage /></Layout>,
  },
  {
    path: "/posts",
    element: <Layout><FeedPage /></Layout>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;


