// import { useState } from "react";
import { FriendProfile } from "../../components/Friends/FriendProfile";
import { RequestButtons } from "../../components/Friends/RequestButtons";
import { AddButton } from "../../components/Friends/AddButton";
import { RemoveButton } from "../../components/Friends/RemoveFriendButton";
import {
  getFriends,
  getOtherUsers,
  getFriendRequests,
} from "../../services/friends";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./FriendsPage.css";

export function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getFriends()
        .then((data) => {
          if (data.ok) {
            setFriends(data.friends);
          } else {
            setErrorMessage(data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });

      getOtherUsers()
        .then((data) => {
          if (data.ok) {
            setOtherUsers(data.otherUsers);
          } else {
            setErrorMessage(data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });

      getFriendRequests()
        .then((data) => {
          if (data.ok) {
            setFriendRequests(data.friendRequests);
          } else {
            setErrorMessage(data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  function handleAddFriends(userId) {
    setOtherUsers(otherUsers.filter((user) => user._id !== userId));
  }

  function handleRemoveFriends(userId) {
    setFriends(friends.filter((user) => user._id !== userId));

    getOtherUsers()
      .then((data) => {
        if (data.ok) {
          setOtherUsers(data.otherUsers);
        } else {
          setErrorMessage(data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }

  function handleRequestAction(userId, actionType) {
    setFriendRequests(
      friendRequests.filter((request) => request.user._id !== userId),
    );
    if (actionType === "accept") {
      getFriends()
        .then((data) => {
          if (data.ok) {
            setFriends(data.friends);
          } else {
            setErrorMessage(data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }

    if (actionType === "delete") {
      getOtherUsers()
        .then((data) => {
          if (data.ok) {
            setOtherUsers(data.otherUsers);
          } else {
            setErrorMessage(data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }

  return (
    <div id="friends-page">
      <div id="friend-requests">
        <h1>Friend requests</h1>
        <div className="scrollable-section">
          {friendRequests?.map((friendRequest) => {
            return (
              <FriendProfile
                key={friendRequest.user._id}
                profileImg={`https://api.dicebear.com/7.x/adventurer/svg?seed=${friendRequest.user._id}&size=60`}
                profileName={`${friendRequest.user.firstName} ${friendRequest.user.lastName}`}
              >
                <div className="requestfriend-btns">
                  <RequestButtons
                    senderId={friendRequest.user._id}
                    onAction={handleRequestAction}
                  />
                </div>
              </FriendProfile>
            );
          })}
          {friendRequests?.length === 0 && (
            <p className="empty-section">No friend requests right now</p>
          )}
        </div>
      </div>
      <div id="other-users-and-friends">
        <div id="other-users">
          <h1>People You may know</h1>
          <div className="scrollable-section">
            {otherUsers?.map((otherUser) => {
              return (
                <FriendProfile
                  key={otherUser._id}
                  profileImg={`https://api.dicebear.com/7.x/adventurer/svg?seed=${otherUser._id}&size=60`}
                  profileName={`${otherUser.firstName} ${otherUser.lastName}`}
                >
                  <div className="addfriend-btn">
                    <AddButton
                      userId={otherUser._id}
                      onAdd={handleAddFriends}
                    />
                  </div>
                </FriendProfile>
              );
            })}
            {otherUsers?.length === 0 && (
              <p className="empty-section">No suggestions right now</p>
            )}
          </div>
        </div>
        <div id="your-friends" className="scrollable-section">
          <h1>Your friends</h1>
          <div className="scrollable-section">
            {friends?.map((friend) => {
              return (
                <FriendProfile
                  key={friend._id}
                  profileImg={`https://api.dicebear.com/7.x/adventurer/svg?seed=${friend._id}&size=60`}
                  profileName={`${friend.firstName} ${friend.lastName}`}
                >
                  <div className="removefriend-btn">
                    <RemoveButton
                      userId={friend._id}
                      onRemove={handleRemoveFriends}
                    />
                  </div>
                </FriendProfile>
              );
            })}
            {friends?.length === 0 && (
              <p className="empty-section">No friends yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
