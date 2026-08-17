import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../css/LoginModal.css";

function LoginModal({ onClose }) {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { login, signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            if (isSignup) {
                await signup(name, email, password);
                setError("Account created! Check your email to verify your address.");
            } else {
                await login(email, password);
                onClose();
            }
        } catch (err) {
            setError(firebaseErrorMessage(err.code));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <input
                            type="text"
                            id="signup-name"
                            name="signup-name"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            required
                        />
                    )}
                    <input
                        type="email"
                        id="login-email"
                        name="login-email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus={!isSignup}
                        required
                    />
                    <input
                        type="password"
                        id="login-password"
                        name="login-password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    {error && <p className="modal-error">{error}</p>}
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Please wait..." : isSignup ? "Create Account" : "Log In"}
                    </button>
                </form>

                <p className="modal-toggle">
                    {isSignup ? "Already have an account?" : "New here?"}{" "}
                    <span onClick={() => { setIsSignup(!isSignup); setError(""); setName(""); }}>
                        {isSignup ? "Log In" : "Sign Up"}
                    </span>
                </p>

                <button className="modal-close" onClick={onClose}>✕</button>
            </div>
        </div>
    );
}

function firebaseErrorMessage(code) {
    switch (code) {
        case "auth/email-already-in-use":
            return "That email is already registered. Try logging in instead.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Incorrect email or password.";
        default:
            return "Something went wrong. Please try again.";
    }
}

export default LoginModal;