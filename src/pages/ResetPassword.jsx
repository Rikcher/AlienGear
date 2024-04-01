import '/src/styles/css/SignIn.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '/src/firebase-config.jsx';
import { fetchSignInMethodsForEmail } from 'firebase/auth';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [errorText, setErrorText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isBlue, setIsBlue] = useState(false);

    //when error message trigerd this function will make sure that it popup for 5s and then disappear
    useEffect(() => {
        if (errorText) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setErrorText(""); // Clear the error text after hiding the message
                setTimeout(() => {
                    setIsBlue(false); // Reset isBlue to false after hiding the message
                }, 500);
            }, 5000); // 5 seconds

            return () => clearTimeout(timer); // Cleanup on component unmount or when errorText changes
        }
    }, [errorText]); // Depend on errorText to trigger the effect

    const handleCheckEmail = async () => {
        try {
            // Check if email exists
            const exists = await checkIfEmailExists(email);
            if (exists) {
                // If email exists, send password reset email
                await sendPasswordResetEmail(auth, email);
                setErrorText("Password reset email sent")
                setIsBlue(true)
            } else {
                setErrorText("Email does not exist in the database.")
                setIsBlue(false)
            }
        } catch (error) {
            setErrorText("Oops! Something went wrong");
            setIsBlue(false)
        }
    };

    // Function to check if email exists 
    const checkIfEmailExists = async (email) => {
        try {
            // Check if email exists
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            return signInMethods.length > 0;
        } catch (error) {
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

            {/* error message */}

            <div className={`errorMessage ${isVisible ? 'show' : ''} ${isBlue ? 'blue' : ''}`}><p>{errorText}</p></div>
        </div>
    );
};

export default ResetPassword;