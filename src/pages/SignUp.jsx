import'/src/styles/css/SignIn.css'
import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import { useState, useEffect} from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '/src/firebase-config.jsx'


const SignUp = () => {
    const navigate = useNavigate();
    const [registerEmail, setRegisterEmail] = useState("")
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const register = async () => {
        try {
            if (password !== confirmPassword) {
                console.log(`Passwords do not match: ${password} and ${confirmPassword}`);
                return;
            }

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, password);
            const user = userCredential.user;
            navigate('/sign-in');
        } catch (err) {
        }
    };

    return (
        <div className="signUpWrapper">
            <h2 className='signUpHeader'>Sign up to AlienGear</h2>
            <div className="container">
                <input
                    type="email"
                    placeholder="Email"
                    className="inputField"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                />
            </div>
            <div className="container">
                <input
                    type="password"
                    placeholder="Password"
                    className="inputField"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="container">
                <input
                    type="password"
                    placeholder="Repeat password"
                    className="inputField"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="container logInButton">
                <Link onClick={register}>Create account</Link>
            </div>
            <p id='tos' className='greyText'>By clicking "Create account" or "Continue with Google", you agree to the <span className='inTextButton'>AlienGear TOS</span> and <span className='inTextButton'>Privacy Policy</span>.</p>
            <p className='greyText'>Already have an account? <span><Link to="/sign-in" className='inTextButton'>Log in</Link></span></p>
        </div>
    );
};

export default SignUp;