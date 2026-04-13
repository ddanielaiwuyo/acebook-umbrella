import { Link } from "react-router-dom";
import { PreLoginButton } from "../../components/PreLoginButton";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home">
      <video autoPlay muted loop className="bg-video">
        <source src="/home.mp4" type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="welcome-content">
        <h3>Connect. Share. Discover.</h3>
        <h1>Welcome to Acebook</h1>

        <p className="tagline">
          Connect with friends, share moments, and build meaningful connections.
        </p>

        <div className="buttons">
          <PreLoginButton to="/signup" className="btn">
            Sign Up
          </PreLoginButton>
          <PreLoginButton to="/login" className="btn">
            Log In
          </PreLoginButton>
        </div>
      </div>
    </div>
  );
}
