import'/src/styles/css/SignIn.css'
import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import { useState, useEffect} from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '/src/firebase-config.jsx'


const SignIn = () => {
    const navigate = useNavigate();
    let [loginEmail, setLoginEmail] = useState("")
    let [loginPassword, setLoginPassword] = useState("")

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Handle successful sign-in, for example, redirect to profile page
            navigate('/profile');
        } catch (error) {
            // Handle errors
            setError(error.message);
        }
    };

    let login = async () => {
        try {
            let user = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            navigate('/profile');
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="signInWrapper">
            <h2 className='signInHeader'>Sign in to AlienGear</h2>
            <div className='container googleButton'>
                <button onClick={googleSignIn}>
                    <img src="/sign-in-page/googleLogo.svg" alt="Google Logo" />
                    Continue with Google
                </button>
            </div>
            <p className='greyText'>or</p>
            <div className="container">
                <input
                type="email"
                placeholder="Email"
                className="inputField"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                />
            </div>
            <div className="container">
                <input
                type="password"
                placeholder="Password"
                className="inputField"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                />
            </div>
            <div className="container logInButton">
                <Link onClick={login}>Log in</Link>
            </div>
            <Link to="/reset-password" className='inTextButton'>Reset password</Link>
            <p className='greyText'>No account? <span><Link to="/sign-up" className='inTextButton'>Create one</Link></span></p>
        </div>
    );
};

export default SignIn;
