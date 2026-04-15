import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileHeader.css";

const ProfileHeader = ({ name, profilePic, isOwner, otherUserId }) => {
	const navigate = useNavigate();

	return (
		<div className="profile-header">
			<div className="avatar-container">
				<img
					src={
						profilePic ||
						`https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`
					}
					alt={name}
					className="profile-avatar"
				/>
			</div>
			<h2 className="profile-name">{name}</h2>
			{isOwner ? (
				<button className="edit-profile-btn">Edit Profile</button>
			) : (
				<button
					className="message-btn"
					onClick={() => navigate(`/messages/${otherUserId}`)}>
					Message
				</button>
			)}
		</div>
	);
};

export default ProfileHeader;
