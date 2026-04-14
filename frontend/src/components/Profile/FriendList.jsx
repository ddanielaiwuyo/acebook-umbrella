import React from "react";
import "./FriendList.css";
import { useNavigate } from "react-router-dom";

const FriendList = ({ friends }) => {
  const navigate = useNavigate();
  return (
    <div className="friend-list">
      <h3>Friends</h3>
      <div className="friend-grid">
        {friends.map((friend) => (
          <div key={friend._id} className="friend-item" onClick={() => navigate(`/profile/${friend._id}`)} style={{ cursor: "pointer" }}>
            <img
              src={
                friend.profilePic ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${friend.name}` 
              }
              alt={friend.name}
              width={60}
              height={60}
              className="friend-avatar"
            />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendList;
