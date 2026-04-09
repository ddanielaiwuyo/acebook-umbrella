import React from "react";
import "./Intro.css";

const Intro = ({ profileInfo }) => {
  const { bio, location, work, birthday, joined } = profileInfo;

  return (
    <div className="intro-card">
      <h3>Intro</h3>
      {bio && <p><strong>About:</strong> {bio}</p>}
      {work && <p><strong>Work:</strong> {work}</p>}
      {location && <p><strong>Location:</strong> {location}</p>}
      {birthday && <p><strong>Birthday:</strong> {birthday}</p>}
      {joined && <p><strong>Joined:</strong> {joined}</p>}
    </div>
  );
};

export default Intro;