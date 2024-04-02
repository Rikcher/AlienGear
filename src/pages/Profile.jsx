import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '/src/firebase-config.jsx';
import '/src/styles/css/Profile.css';
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const initialFormData = {
        usernameInput: '',
        oldPasswordInput: '',
        newPasswordInput: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [editMode, setEditMode] = useState({ name: false, password: false });
    const [errorText, setErrorText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isBlue, setIsBlue] = useState(false);
    const [showPassword, setShowPassword] = useState(false)


    //this function upadtes user auth status 
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    //when error message trigerd this function will make sure that it popup for 5s and then disappear
    useEffect(() => {
        if (errorText) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    setIsBlue(false);
                }, 100) // delay for 0.1s so it doesnt flicker back to red instantly as it disappears
                setErrorText("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorText]);

    //function to reset value in input fields when user successfully saves changes
    const resetFormData = () => {
        setFormData(initialFormData);
    };

    //this function updates value in inputfields on user input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    //this function resets state of username / password elements when user successfully saves changes
    const handleEditToggle = (field) => {
        setEditMode(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


    //function to logout
    const logout = async () => {
        try {
            await signOut(auth);
            navigate('/sign-in');
        } catch (error) {
            setErrorText("Oops! Something went wrong");
        }
    };


    //function to change users username
    const saveChangesUsername = async () => {
        if (!formData.usernameInput.trim()) return; //check if username inputfiled is empty, if so do nothing
        try {
            if (formData.usernameInput.trim() === user.displayName) {
                setErrorText("This username same as old one");
                return
            }
            await updateProfile(user, { displayName: formData.usernameInput });
            setIsBlue(true)
            setErrorText("Changes saved successfully");
            handleEditToggle('name');
            resetFormData();
        } catch (error) {
            setErrorText("Failed to save username");
        }
    };

    //function to change users password
    const saveChangesPassword = async () => {
        if (!formData.oldPasswordInput || !formData.newPasswordInput) { //cheks if both inputs are empty
            setErrorText("Fill both password fields");
            return
        };
        try {
            if(formData.oldPasswordInput === formData.newPasswordInput) {
                setErrorText("New password is same as old password");
                return
            }
            const credential = EmailAuthProvider.credential(user.email, formData.oldPasswordInput);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, formData.newPasswordInput);
            setIsBlue(true)
            setErrorText("Password updated successfully");
            handleEditToggle('password');
            resetFormData();
        } catch (error) {
            if (error.code === "auth/wrong-password") {
                setErrorText("You entered wrong old password");
            } else if (error.code === "auth/weak-password") {
                setErrorText("New password too short");
            } else {
                setErrorText("Oops! Something went wrong");
            }
            
        }
    };

    //show password button functionality
    const handleShowPassword = () => {
        showPassword ? setShowPassword(false) : setShowPassword(true)
    }

    //loading indicator
    if (loading) return (
        <div className='loadingProfileWrapper'>
            <div className="userProfileImage"></div>
            <h2 className='userEmail'></h2>
            <div className="userInformation">
                <p className="informationTitle"></p>
                <label className="information"></label>
                <p className="informationTitle two"></p>
                <label className="information two"></label>
            </div>
            <button className="buttons logOut"></button>
            <div className='loadingDisk'></div>
        </div>
    )


    return (
        <div className="profileWrapper">
            <div className="userProfileImage">
                <img src="/navbar/NavbarUserProfileIcon.svg" alt=""/> 
                <div className='hover'>edit image</div>
            </div>
            <h2 className='userEmail'>{user?.email}</h2>
            <div className="userInformation">
                <div>
                    <p className="informationTitle">name</p>
                    {!editMode.name ? (
                        <label className="information" onClick={() => handleEditToggle('name')}>
                            <p className="userName">{user.displayName || "Default user"}</p>
                            <img src="/profile-page/editIcon.svg" alt="Edit" />
                        </label>
                    ) : (
                        <>
                            <input
                                maxLength="40"
                                placeholder='Enter new username'
                                className='inputField'
                                name="usernameInput"
                                value={formData.usernameInput}
                                onChange={handleChange}
                                autoFocus
                            />
                            <div className='buttonsWrapper'>
                                <button className='buttons' onClick={saveChangesUsername}>Save changes</button>
                                <button className='buttons cancel' onClick={() => handleEditToggle('name')}>Cancel</button>
                            </div>
                        </>
                    )}
                </div>
                <div>
                    <p className="informationTitle">password</p>
                    {!editMode.password ? (
                        <label className="information" onClick={() => handleEditToggle('password')}>
                            <p className="userPassword">*************</p>
                            <img src="/profile-page/editIcon.svg" alt="Edit" />
                        </label>
                    ) : (
                        <> 
                            <div className='passwordWithIcon'>
                                <input
                                    className='inputField'
                                    name="oldPasswordInput"
                                    placeholder="Enter old password"
                                    value={formData.oldPasswordInput}
                                    onChange={handleChange}
                                    type={`${showPassword ? 'text' : 'password'}`}
                                />
                                <div onClick={handleShowPassword} className={`passwordVisabilityIcon ${showPassword ? 'show' : ''}`}></div>
                            </div>
                            <input
                                className='inputField'
                                name="newPasswordInput"
                                placeholder="Enter new password"
                                value={formData.newPasswordInput}
                                onChange={handleChange}
                                type={`${showPassword ? 'text' : 'password'}`}
                            />
                            <div className='buttonsWrapper'>
                                <button className='buttons' onClick={saveChangesPassword}>Save changes</button>
                                <button className='buttons cancel' onClick={() => handleEditToggle('password')}>Cancel</button>
                            </div>
                            
                        </>
                    )}
                </div>
            </div>
            <button onClick={logout} className="buttons logOut">Log out</button>
            <div className={`errorMessage ${isBlue ? 'blue' : ''} ${isVisible ? 'show' : ''}`}>{errorText}</div>
        </div>
    );
};

export default Profile;
