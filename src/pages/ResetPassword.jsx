import '/src/styles/css/SignIn.css';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '/src/firebase-config.jsx';
import { fetchSignInMethodsForEmail } from 'firebase/auth';

const ResetPassword = () => {
    const [email, setEmail] = useState('');

    const handleCheckEmail = async () => {
        try {
            // Check if email exists
            const exists = await checkIfEmailExists(email);
            if (exists) {
                // If email exists, send password reset email
                await sendPasswordResetEmail(auth, email);
                alert("Password reset email sent. Please check your inbox.");
            } else {
                alert("Email does not exist in the database.");
            }
        } catch (error) {
            console.error("Error sending password reset email:", error);
            alert("Error sending password reset email. Please try again.");
        }
    };

    // Function to check if email exists (you need to implement this)
    const checkIfEmailExists = async (email) => {
        try {
            // Check if email exists
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            console.log(signInMethods)
            console.log(auth)
            // If signInMethods array has length > 0, it means the email exists
            return signInMethods.length > 0;
        } catch (error) {
            console.log(signInMethods)
            console.error("Error checking if email exists:", error);
            // Return false in case of an error or if email doesn't exist
            return false;
        }
    };

    return (
        <div className="signInWrapper">
            <h2 className='resetPasswordHeader'>Enter your email</h2>
            <h3>The one that you use to sign in with</h3>
            <div className="container">
                <input
                    type="email"
                    placeholder="Email"
                    className="inputField"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="container logInButton">
                <Link onClick={handleCheckEmail}>Send password reset message</Link>
            </div>
            <p id='goBack' className='greyText'>Go back to <span><Link to="/sign-in" className='inTextButton'>Log in</Link></span> page</p>
        </div>
    );
};

export default ResetPassword;