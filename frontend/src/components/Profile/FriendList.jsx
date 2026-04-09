import React from "react";
import "./FriendList.css";

const FriendList = ({ friends }) => {
  return (
    <div className="friend-list">
      <h3>Friends</h3>
      <div className="friend-grid">
        {friends.map((friend) => (
          <div key={friend._id} className="friend-item">
            <img
              src={
                friend.profilePic || `https://i.pravatar.cc/60?u=${friend._id}` // unique avatar per friend
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
