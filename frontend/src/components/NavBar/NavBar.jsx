import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
	FaHome,
	FaUserFriends,
	FaBell,
	FaUserCircle,
	FaSignOutAlt,
	FaUser,
	FaRegComment,
} from "react-icons/fa";
import "./NavBar.css";

function NavBar() {
	const navigate = useNavigate();
	const location = useLocation();
	const isLoggedIn =
		localStorage.getItem("token") !== null &&
		localStorage.getItem("token") !== "undefined";
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [profileOpen, setProfileOpen] = useState(false);
	const profileRef = useRef(null);

	function handleLogout() {
		localStorage.removeItem("token");
		navigate("/");
	}

	async function handleSearch(e) {
		const value = e.target.value;
		setQuery(value);

		if (value.trim() === "") {
			setResults([]);
			return;
		}

		try {
			const response = await fetch(
				`http://localhost:3000/users/search?query=${value}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				},
			);
			const data = await response.json();
			setResults(data.users ?? []);
		} catch (err) {
			setResults([]);
		}
	}

	function handleResultClick() {
		setQuery("");
		setResults([]);
	}

	useEffect(() => {
		function handleClickOutside(e) {
			if (profileRef.current && !profileRef.current.contains(e.target)) {
				setProfileOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const isActive = (path) => location.pathname === path;

	return (
		<nav className="navbar">
			<div className="navbar-left">
				<Link to={isLoggedIn ? "/feed" : "/"} className="navbar-logo-link">
					<div className="navbar-logo">A</div>
				</Link>

				<div className="navbar-search-wrapper">
					<input
						className="navbar-search"
						type="text"
						placeholder="Search Acebook"
						value={query}
						onChange={handleSearch}
					/>
					{results.length > 0 && (
						<div className="search-dropdown">
							{results.map((user) => (
								<Link
									key={user._id}
									to={`/profile/${user._id}`}
									onClick={handleResultClick}
									className="search-result">
									<FaUserCircle className="search-result-icon" />
									{user.firstName && user.lastName
										? `${user.firstName} ${user.lastName}`
										: user.email}
								</Link>
							))}
						</div>
					)}
				</div>
			</div>

			{isLoggedIn && (
				<div className="navbar-centre">
					<Link
						to="/feed"
						className={`nav-icon-link ${isActive("/feed") ? "active" : ""}`}
						title="Feed">
						<FaHome />
					</Link>
					<Link
						to="/friends"
						className={`nav-icon-link ${isActive("/friends") ? "active" : ""}`}
						title="Friends">
						<FaUserFriends />
					</Link>
					<Link
						to="/notifications"
						className={`nav-icon-link ${isActive("/notifications") ? "active" : ""}`}
						title="Notifications">
						<FaBell />
					</Link>
					<Link
						to="/messages"
						className={`nav-icon-link ${isActive("/messages") ? "active" : ""}`}
						title="Messages">
						<FaRegComment />
					</Link>
				</div>
			)}
			<div className="navbar-right">
				{isLoggedIn ? (
					<div className="profile-menu-wrapper" ref={profileRef}>
						<button
							className="navbar-avatar-btn"
							onClick={() => setProfileOpen((prev) => !prev)}
							title="Account">
							<FaUserCircle />
						</button>

						{profileOpen && (
							<div className="profile-dropdown">
								<Link
									to="/profile"
									className="profile-dropdown-item"
									onClick={() => setProfileOpen(false)}>
									<FaUser className="dropdown-icon" />
									Profile
								</Link>
								<div className="profile-dropdown-divider" />
								<button
									className="profile-dropdown-item logout"
									onClick={handleLogout}>
									<FaSignOutAlt className="dropdown-icon" />
									Sign out
								</button>
							</div>
						)}
					</div>
				) : (
					<>
						<Link to="/login" className="navbar-auth-link">
							Log in
						</Link>
						<Link to="/signup" className="navbar-auth-link primary">
							Sign up
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}

export default NavBar;
