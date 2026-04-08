// import { useState } from "react";
import { FriendProfile } from "../../components/FriendProfile";
import { RequestButtons } from "../../components/RequestButtons";
import { AddButton } from "../../components/AddButton"

const profiles = [
	{
		id: 1,
		profileImg: "https://placeholder.com",
		profileName: "Jay Wills",
	},
	{
		id: 2,
		profileImg: "https://placeholder.com",
		profileName: "Sally Wally",
	},
	{
		id: 3,
		profileImg: "https://placeholder.com",
		profileName: "Billy Bob",
	},
	{
		id: 4,
		profileImg: "https://placeholder.com",
		profileName: "Jullie Briggs",
	},
	{
		id: 5,
		profileImg: "https://pravatar.cc",
		profileName: "Sandy Woods",
	},
];

export function FriendsPage() {
	return (
		<div>
			<div>
				<h1>Friend requests</h1>
				{profiles.map((profile) => {
					return (
						<FriendProfile
							key={profile.id}
							profileImg={profile.profileImg}
							profileName={profile.profileName}>
							<RequestButtons />
						</FriendProfile>
					);
				})}
			</div>
			<div>
				<h1>People You may know</h1>
				{profiles.map((profile) => {
					return (
						<FriendProfile
							key={profile.id}
							profileImg={profile.profileImg}
							profileName={profile.profileName}>
							<AddButton />
						</FriendProfile>
					);
				})}
			</div>
			<div>
				<h1>Your friends</h1>
				{profiles.map((profile) => {
					return (
						<FriendProfile
							key={profile.id}
							profileImg={profile.profileImg}
							profileName={profile.profileName}>
						</FriendProfile>
					);
				})}
			</div>
		</div>
	);
}
