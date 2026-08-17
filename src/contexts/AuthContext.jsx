import { createContext, useState, useContext, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";
import { auth } from "../firebase";
import { sendWelcomeBackEmail } from "../services/emailService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signup = async (name, email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await sendEmailVerification(result.user);
        return result.user;
    };

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        try {
            await sendWelcomeBackEmail(result.user.email);
        } catch (err) {
            console.log("Welcome email failed to send:", err);
        }
        return result.user;
    };

    const logout = async () => {
        await signOut(auth);
    };

    const value = { user, authLoading, signup, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};