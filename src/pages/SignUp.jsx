import'/src/styles/css/SignIn.css'
import { Link, useNavigate } from "react-router-dom";
import React from 'react';
import { useState, useEffect} from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '/src/firebase-config.jsx'


const SignUp = () => {
    const navigate = useNavigate();
    const [registerEmail, setRegisterEmail] = useState("")
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [isVisible, setIsVisible] = useState(false);
    const [emailValid, setEmailValid] = useState(true); // New state for email validation
    const [errorText, setErrorText] = useState("");

    //when error message trigerd this function will make sure that it popup for 5s and then disappear
    useEffect(() => {
        if (errorText) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setErrorText(""); // Clear the error text after hiding the message
            }, 5000); // 5 seconds

            return () => clearTimeout(timer); // Cleanup on component unmount or when errorText changes
        }
    }, [errorText]); // Depend on errorText to trigger the effect

    //show password button functionality
    const handleShowPassword = () => {
        showPassword ? setShowPassword(false) : setShowPassword(true)
    }

    //check if email contains valid symbols
    const validateEmail = (email) => {
        // Simple regex for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    //on email change typed email and second email for email validation
    const handleEmailChange = (e) => {
        const email = e.target.value;
        setRegisterEmail(email);
        setEmailValid(validateEmail(email)); // Validate the email and update state
    };

    //register functionality
    const register = async () => {
        try {
            if (!emailValid) {
                setErrorText("Please enter a valid email")
                return
            } else if (password !== confirmPassword) {
                setErrorText("Passwords do not match")
                return;
            } else if (password.length < 6) {
                setErrorText("Password is too short")
                return;
            }

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, password);
            await sendEmailVerification(userCredential.user); //sends email verification
            navigate('/sign-in', { state: { justSignedUp: true } }); //redirect to sign in page and triger popup
        } catch (err) {
            if (err.code == 'auth/email-already-in-use') {
                setErrorText("This email already registered");
            } else if (err.code === 'auth/missing-password') {
                setErrorText("Please enter a password");
            } else {
                setErrorText("Oops! Something went wrong");
            }
        }
    };

    return (
        <div className="signUpWrapper">
            <h2 className='signUpHeader'>Sign up to AlienGear</h2>
            <div className="container">
                <input
                    maxLength="40"
                    type="email"
                    placeholder="Email"
                    className="inputField"
                    value={registerEmail}
                    onChange={handleEmailChange}
                />
            </div>
            <div className="container">
                <input
                    type={`${showPassword ? 'text' : 'password'}`}
                    placeholder="Password"
                    className="inputField"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div onClick={handleShowPassword} className={`passwordVisabilityIcon ${showPassword ? 'show' : ''}`}></div>
            </div>
            <div className="container">
                <input
                    type={`${showPassword ? 'text' : 'password'}`}
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

            {/* error message */}

            <div className={`errorMessage ${isVisible ? 'show' : ''}`}><p>{errorText}</p></div>
        </div>
    );
};

export default SignUp;