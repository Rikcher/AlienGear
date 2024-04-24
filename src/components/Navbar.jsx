import { Outlet, Link, useNavigate } from "react-router-dom";
import '/src/styles/css/Navbar.css';
import { auth } from '/src/firebase-config.jsx';
import { getDatabase, ref, onValue } from 'firebase/database';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [user, setUser] = useState(auth.currentUser);
    const [totalItems, setTotalItems] = useState(0); // State for total items in cart
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // State to track screen width
    const [openMenu, setOpenMenu] = useState(false); // State to track screen width
    const navigate = useNavigate()

    const getTotalItemsInCart = async (user) => {
        if (!user) {
            setTotalItems(0); // Reset total items if user is not logged in
            return;
        }
        const database = getDatabase();
        const cartRef = ref(database, `carts/${user.uid}`);
        onValue(cartRef, (snapshot) => {
            const cartData = snapshot.val();
            if (cartData) {
                const cartItems = Object.values(cartData);
                // Calculate the total item count directly
                const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
                setTotalItems(itemCount); // Update the state with the total item count
            } else {
                setTotalItems(0);
            }
        });
    };

    const handleMenuClick = () => {
        setOpenMenu(!openMenu);
    }

    useEffect(() => {
        // Listen for changes in the user's authentication status
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            getTotalItemsInCart(user);
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, []);

    // Function to handle window resize
    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };

    // Add event listener for window resize
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        // Cleanup the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    //Function to check the current URL and update the body's style accordingly
    function updateBodyOverflow() {
    // Get the current URL
    const currentUrl = window.location.pathname;

    // Check if the current URL is '/'
    if (currentUrl === '/') {
        // If the URL is '/', set the body's overflow to hidden
        document.body.style.overflow = 'hidden';
    } else {
        // If the URL is not '/', reset the body's overflow to its default value
        document.body.style.overflow = '';
    }
    }

    // Call the function initially to set the correct style
    updateBodyOverflow();

    // Example: Call the function again when the URL changes (e.g., after a route change in a single-page application)
    // This is just an example. You'll need to integrate this with your specific routing or page change logic.
    window.addEventListener('popstate', updateBodyOverflow);

    return ( 
        <>
        <header 
            >
            <nav>
                <img onClick={() => navigate("/")} id="navbarLogo" src="/navbar/NavbarAppIcon.svg" alt="AlienGear logo" />
                {screenWidth <= 1024 ? (
                    <div className="menu" onClick={() => handleMenuClick()}>
                        <div 
                        className="top"
                        style={{
                            transform: openMenu ? "rotate(-45deg) translateY(-4.5px)" : "",
                            transformOrigin: "100% 50%",
                            borderRadius: openMenu ? "8px" : ""
                        }}
                        ></div>
                        <div 
                        className="center"
                        style={{
                            opacity: openMenu ? "0" : "100%",
                        }}
                        ></div>
                        <div 
                        className="bottom"
                        style={{
                            transform: openMenu ? "rotate(45deg) translateY(4.5px)" : "",
                            transformOrigin: "100% 50%",
                            borderRadius: openMenu ? "8px" : ""
                        }}
                        ></div>
                    </div>
                ) : null}
                <div 
                className="navLinks" 
                style={screenWidth <= 1024  ? {
                    transform: openMenu ? "translateY(24.167em)" : "translateY(0)",
                } : null}>
                    {screenWidth > 1024 ? (
                        <>
                        <Link to="/" className="button">
                            <img className="buttonAnimate home" src="/navbar/HomeButtonBackground.svg" alt="" />
                            <p className="link text">HOME</p>
                        </Link>
                        <Link to="/products" className="button">
                            <img className="buttonAnimate product" src="/navbar/ProductButtonBackground.svg" alt="" />
                            <p className="link text">PRODUCTS</p>
                        </Link>
                        <Link to="/about-us" className="button">
                            <img className="buttonAnimate aboutus" src="/navbar/AboutUsButtonBackground.svg" alt="" />
                            <p className="link text">ABOUT US</p>
                        </Link>
                        <Link to="/search" className="button">
                            <img className="buttonAnimate search" src="/navbar/UserButtonBackground.svg" alt="" />
                            <div className="link icon search">
                                <div></div>
                            </div>
                        </Link>
                        <Link to={user ? "/profile" : "/sign-in"} className="button">
                            <img className="buttonAnimate user" src="/navbar/UserButtonBackground.svg" alt="" />
                            <div className="link icon user">
                                <div></div>
                            </div>
                        </Link>
                        <Link to="/cart" className="button">
                            <img className="buttonAnimate cart" src="/navbar/CartButtonBackground.svg" alt="" />
                            <div className="link icon cart">
                                <div></div>
                                <span style={{display: user && totalItems != 0  ? "flex" : "none"}}>{totalItems}</span>
                            </div>
                        </Link>
                        </>
                    ) : (
                        <>
                        <Link to="/" className="button" onClick={() => handleMenuClick()}>
                            <p className="link text">HOME</p>
                        </Link>
                        <Link to="/products" className="button" onClick={() => handleMenuClick()}>
                            <p className="link text">PRODUCTS</p>
                        </Link>
                        <Link to="/about-us" className="button" onClick={() => handleMenuClick()}>
                            <p className="link text">ABOUT US</p>
                        </Link>
                        <Link to="/search" className="button" onClick={() => handleMenuClick()}>
                            <p className="link text">SEARCH</p>
                        </Link>
                        <Link to={user ? "/profile" : "/sign-in"} className="button" onClick={() => handleMenuClick()}>
                            <p className="link text">PROFILE</p>
                        </Link>
                        <Link to="/cart" className="button" onClick={() => handleMenuClick()}>
                            <p className="link text">CART</p>
                        </Link>
                        </>
                    )}
                    
                </div>
            </nav>
        </header>
        <main>
            <Outlet />
        </main>
        </>
    );
}

export default Navbar;


