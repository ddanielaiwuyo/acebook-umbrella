import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../services/authentication";

import { PreLoginButton } from "../../components/PreLoginButton";
import { InputField } from "../../components/InputField";

import "./LoginPage.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/feed");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }

  // function handleEmailChange(event) {
  //   setEmail(event.target.value);
  // }

  // function handlePasswordChange(event) {
  //   setPassword(event.target.value);
  // }

  return (
    <div className="login-page">
      <div className="left-container">
        <div className="login-form">
          <h1>Welcome back</h1>
          <form onSubmit={handleSubmit}>
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              type="password"
              placeholder="PAssword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <div className="btn">
            <PreLoginButton>Log In</PreLoginButton>
          </div>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
