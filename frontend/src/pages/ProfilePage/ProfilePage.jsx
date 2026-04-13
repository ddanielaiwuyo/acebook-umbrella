import { useState } from "react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import FriendList from "../../components/Profile/FriendList";
import Intro from "../../components/Profile/Intro";
import "./ProfilePage.css";

export const ProfilePage = () => {
  let username = "Aplha One";
  const [profileInfo] = useState({
    name: "Alpha One",
    profilePic:
      "" || `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`, // optional placeholder image
    bio: "Incoming",
    location: "London, UK",
    work: "Frontend Developer at ACEBOOK",
    birthday: "January 1, 1990",
    joined: "2026",
    friends: [
      { _id: "1", name: "Beta One", profilePic: "" },
      { _id: "2", name: "Charlie One", profilePic: "" },
    ],
  });

  // Set isOwner true for now (in real app, compare with logged-in user)
  const isOwner = true;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <ProfileHeader
        name={profileInfo.name}
        profilePic={profileInfo.profilePic}
        isOwner={isOwner}
      />

      {/* Two-column layout */}
      <div className="profile-columns">
        {/* Left column: Intro + Friends */}
        <div className="left-column">
          <Intro profileInfo={profileInfo} />
          <FriendList friends={profileInfo.friends} />
        </div>

        {/* Right column: Posts placeholder */}
        <div className="right-column">
          <div className="box">Posts (coming soon)</div>
        </div>
      </div>
    </div>
  );
};
