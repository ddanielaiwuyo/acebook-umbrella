import { Link } from "react-router-dom";

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
            <Link to="/signup" className="btn">
              Sign Up
            </Link>
            <Link to="/login" className="btn">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
