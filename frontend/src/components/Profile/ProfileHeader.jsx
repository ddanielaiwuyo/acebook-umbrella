import React from "react";
import "./ProfileHeader.css";

const ProfileHeader = ({ name, profilePic, isOwner }) => {
  return (
    <div className="profile-header">
      <div className="avatar-container">
        <img
          src={profilePic || "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"}
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