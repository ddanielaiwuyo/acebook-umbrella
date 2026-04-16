import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ProfileHeader from "../../components/Profile/ProfileHeader";
import FriendList from "../../components/Profile/FriendList";
import Intro from "../../components/Profile/Intro";
import "./ProfilePage.css";

export const ProfilePage = () => {
	const { profile_id } = useParams();
	const navigate = useNavigate();
	const [profileInfo, setProfileInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loggedInUserId, setLoggedInUserId] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
			return;
		}
		const payload = JSON.parse(atob(token.split(".")[1]));
		setLoggedInUserId(payload.sub);

		if (!profile_id) {
			navigate(`/profile/${payload.sub}`, { replace: true });
			return;
		}

		const fetchProfile = async () => {
			try {
				const res = await fetch(`http://localhost:3000/profile/${profile_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const body = await res.json();

				// console.log(body); // delete this later - don't forget!

				if (body.ok) {
					setProfileInfo(body.data);
				} else {
					setErrorMessage(body.message);
				}
			} catch (err) {
				console.error(err);
				setErrorMessage("Service is down, please try again later");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [profile_id, navigate]);

	if (loading) {
		return <div>Loading profile...</div>;
	}

	if (errorMessage) {
		return <div>{errorMessage}</div>;
	}

	if (!profileInfo) {
		return <div>No profile found</div>;
	}

	const isOwner = profileInfo._id.toString() === loggedInUserId?.toString();

	return (
		<div className="profile-page">
			<ProfileHeader
				name={`${profileInfo.firstName} ${profileInfo.lastName}`}
				profilePic={profileInfo.profilePic}
				isOwner={isOwner}
				otherUserId={profileInfo._id}
			/>

			<div className="profile-columns">
				<div className="left-column">
					<Intro profileInfo={profileInfo} />
					<FriendList friends={profileInfo.friends} />
				</div>

				<div className="right-column">
					<div className="box">
						{profileInfo.posts?.map((post) => (
							<div key={post._id}>
								<p>{post.content}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
