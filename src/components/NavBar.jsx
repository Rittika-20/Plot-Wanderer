import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import "../css/NavBar.css";

function NavBar() {
    const { user, logout } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
            <nav className="navbar">
                <div className="nav-brand">
                    <Link to="/">Plot Wanderer</Link>
                </div>
                <div className="navbar-links">
                    <Link to="/" className="nav-link">Homepage</Link>
                    <Link to="/favourites" className="nav-link">Favourites ♥</Link>

                    {user ? (
                        <div className="user-account">
                          <span className="user-name">Hi, {user.email}</span>
                          <button className="logout-btn" onClick={logout}>Logout</button>
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => setShowLogin(true)}>
                            Log In
                        </button>
                    )}
                </div>
            </nav>

            {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </>
    );
}
export default NavBar;