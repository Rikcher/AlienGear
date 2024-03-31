import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '/src/firebase-config.jsx';
import '/src/styles/css/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <>
            <h1 style={{ color: "white" }}>Profile</h1>
            {user ? (
                <>
                    <p>Email: {user.email}</p>
                    <p>Display Name: {user.displayName}</p>
                </>
            ) : (
                <p>No user logged in</p>
            )}
            <button onClick={logout}>Log Out</button>
        </>
    );
};

export default Profile;
