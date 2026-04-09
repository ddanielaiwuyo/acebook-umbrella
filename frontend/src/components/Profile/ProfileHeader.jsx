import React from "react";
import "./ProfileHeader.css";

const ProfileHeader = ({ name, profilePic, isOwner }) => {
  return (
    <div className="profile-header">
      <div className="avatar-container">
        <img
          src={profilePic || "https://via.placeholder.com/130"}
          alt={name}
          className="profile-avatar"
        />
      </div>
      <h2 className="profile-name">{name}</h2>
      {isOwner && <button className="edit-profile-btn">Edit Profile</button>}
    </div>
  );
};

export default ProfileHeader;