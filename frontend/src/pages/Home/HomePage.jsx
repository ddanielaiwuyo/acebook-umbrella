import { Link } from "react-router-dom";
import { PreLoginButton } from "../../components/PreLoginButton";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home">
      <div className="left-container">
        {/* Empty for now, I will look into adding an image later */}
      </div>

      <div className="right-container">
        <div className="home-content">
          <h1>Welcome to Acebook</h1>
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
    </div>
  );
}
