import { useState } from "react";
import ProfileHeader from "../../components/Profile/ProfileHeader";
import FriendList from "../../components/Profile/FriendList";
import Intro from "../../components/Profile/Intro";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const [profileInfo] = useState({
    name: "Alpha One",
    profilePic: "", // optional placeholder image
    bio: "This is my placeholder bio.",
    location: "New York, USA",
    work: "Frontend Developer at ABC Corp",
    birthday: "January 1, 1990",
    joined: "2023",
    friends: [
      { _id: "1", name: "Alpha Two", profilePic: "" },
      { _id: "2", name: "Beta One", profilePic: "" },
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