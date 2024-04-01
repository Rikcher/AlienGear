import'/src/styles/css/SignIn.css'
import { Link, useNavigate, useLocation } from "react-router-dom";
import React from 'react';
import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '/src/firebase-config.jsx'


const SignIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [isVisible, setIsVisible] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [justSignedUp, setJustSignedUp] = useState(false);

    //after user created account he is redirected to sign in pagem this function is trigering popup that will tell user to check email for verification mail
    useEffect(() => {
        if (location.state && location.state.justSignedUp) {
            setErrorText("Please check your email for verification");
            setJustSignedUp(true);
        }
    }, [location]);

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

    //google sign in functionality
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(result => {
                navigate('/profile');
            })
            .catch(error => {
                setErrorText("Oops! Something went wrong");
            });
    };

    //login functionality
    let login = () => {
        setJustSignedUp(false); //to make sure that error popup are red coloed
        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then(user => {
            navigate('/profile'); //if email and password are correct
        })
        .catch(err => {
            if (err.code === 'auth/wrong-password') {
                setErrorText("Wrong password");
            } else if (err.code === "auth/invalid-email"){
                setErrorText("This email does not exist");
            } else if(err.code === "auth/user-not-found") {
                setErrorText("This user does not exist");
            } else {
                setErrorText("Oops! Something went wrong");
            }
            
        });
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
                type={`${showPassword ? 'text' : 'password'}`}
                placeholder="Password"
                className="inputField"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                />
                <div onClick={handleShowPassword} className={`passwordVisabilityIcon ${showPassword ? 'show' : ''}`}></div>
            </div>
            <div className="container logInButton">
                <Link onClick={login}>Log in</Link>
            </div>
            <Link to="/reset-password" className='inTextButton'>Reset password</Link>
            <p className='greyText'>No account? <span><Link to="/sign-up" className='inTextButton'>Create one</Link></span></p>
            {/* error message */}

            <div className={`errorMessage ${isVisible ? 'show' : ''} ${justSignedUp ? 'blue' : ''}`}><p>{errorText}</p></div>
        </div>
    );
};

export default SignIn;
