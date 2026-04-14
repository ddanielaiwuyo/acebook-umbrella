import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { login } from "../../services/authentication";

import { PreLoginButton } from "../../components/PreLoginButton";
import { InputField } from "../../components/InputField";

import { FaEnvelope, FaLock } from "react-icons/fa";

import "./LoginPage.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { token, message, status } = await login(email, password);
      if (status != 200) {
        setError(message);
        return;
      }

      setError("");
      localStorage.setItem("token", token);
      navigate("/feed", { replace: true }); // To prevent user to go to login page again if pressing bckspace;
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  return (
    <div className="login-page">
      <video autoPlay muted loop className="bg-video">
        <source src="home.mp4" type="video/mp4" />
      </video>
      <div className="overlay"></div>
      <div className="content">
        <div className="left-container">
          <div className="login-form">
            <p className="errors">{error}</p>
            <h1>{message ? "Account Created" : "Welcome back"}</h1>
            {message && <p className="success-message">{message}</p>}
            <form onSubmit={handleSubmit}>
              <InputField
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={FaEnvelope}
              />

              <InputField
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={FaLock}
              />
              <div className="btn">
                <PreLoginButton type="submit">Log in</PreLoginButton>
              </div>
              <div className="not-registered">
                <p>
                  Don't have an account yet?{" "}
                  <Link to="/signup">
                    <strong>Sign up</strong>
                  </Link>{" "}
                  and start your journey.
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="right-container"></div>
      </div>
    </div>
  );
}
