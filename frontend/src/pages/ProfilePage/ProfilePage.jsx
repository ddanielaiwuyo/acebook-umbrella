import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProfileHeader from "../../components/Profile/ProfileHeader";
import FriendList from "../../components/Profile/FriendList";
import Intro from "../../components/Profile/Intro";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const { profile_id } = useParams();

  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3000/profile/${profile_id}`);
        const data = await res.json();

        setProfileInfo(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [profile_id]);

  if (loading || !profileInfo) {
    return <div>Loading profile...</div>;
  }

  const isOwner = true;

  return (
    <div className="profile-page">

      <ProfileHeader
        name={profileInfo.name}
        profilePic={profileInfo.profilePic}
        isOwner={isOwner}
      />

      <div className="profile-columns">

        <div className="left-column">
          <Intro profileInfo={profileInfo} />
          <FriendList friends={profileInfo.friends} />
        </div>

        <div className="right-column">
          <div className="box">
            {profileInfo.posts.map((post) => (
              <div key={post._id}>
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
