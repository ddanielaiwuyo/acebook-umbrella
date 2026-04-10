import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./NavBar.css"

function NavBar () {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token") !== null;
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    async function handleSearch(e) {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === ""){
            setResults([]);
            return;
        }

        const response = await fetch(`http://localhost:3000/users/search?query=${value}`, {
        headers : {Authorization: `Bearer ${localStorage.getItem("token")}`}
        });
        const data = await response.json();
        setResults(data.users);
    }

    function handleResultClick(){
        setQuery("");
        setResults([]);
    }


    return <nav className="navbar">
        <Link to={isLoggedIn ? "/posts" : "/"}>
            <img className="logo" src="data:image/jpeg;base64,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" />
        </Link>

        {isLoggedIn ? (
            <div className="navbar-links">

                <div className="navbar-search-wrapper">
                    <input
                        className="navbar-search"
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={handleSearch}
                    />
                    {results.length > 0 && (
                        <div className="search-dropdown">
                            {results.map(user => (
                                <Link
                                    key={user._id}
                                    to={`/profile/${user._id}`}
                                    onClick={handleResultClick}
                                >
                                    {user.email}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <Link to="/posts">Feed</Link>
                <Link to="/friends">Friends</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/" onClick={handleLogout}>Log out</Link>
                <img className="placeholder-notification-image" src="data:image/png;base64,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" />
                <img className="placeholder-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf1fiSQO7JfDw0uv1Ae_Ye-Bo9nhGNg27dwg&s" />
            </div>
        ) : (
            <>
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign up</Link>
            </>
        )}
    </nav>
}

export default NavBar;