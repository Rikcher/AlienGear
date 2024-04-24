import { Outlet, Link, useNavigate } from "react-router-dom";
import '/src/styles/css/Navbar.css';
import { auth } from '/src/firebase-config.jsx';
import { getDatabase, ref, onValue } from 'firebase/database';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [user, setUser] = useState(auth.currentUser);
    const [totalItems, setTotalItems] = useState(0); 
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); 
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate()

    //if user is logged in and have items in cart, show number of items on top of cart icon
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

    //show and hide menu on click in mobile view
    const handleMenuClick = () => {
        setOpenMenu(!openMenu);
    }

    useEffect(() => {
        // Listen for changes in the user's authentication status
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user); //upadate user
            getTotalItemsInCart(user); //update his items count
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


    //Function to check the current URL and update the body's style accordingly. This will set overflow to hidden on home page. On pc screen sizes this changes nothing but on mobile it will prevent anonying scroll that url ui is causing
    function updateBodyOverflow() {
    const currentUrl = window.location.pathname;

    if (currentUrl === '/') {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    }
    // Call the function initially to set the correct style
    updateBodyOverflow();

    //Call the function again when the URL changes 
    window.addEventListener('popstate', updateBodyOverflow);

    return ( 
        <>
        <header 
            >
            <nav>
                <img onClick={() => navigate("/")} id="navbarLogo" src="/navbar/NavbarAppIcon.svg" alt="AlienGear logo" />
                {/* on mobile view, hide navbar links and place menu icon that will show / hide links upon clicking */}
                {screenWidth <= 1024 ? (
                    <div className="menu" onClick={() => handleMenuClick()}>
                        <div 
                        className="top"
                        style={{
                            transform: openMenu ? "rotate(-45deg) translateY(-4.5px)" : "", //just animation for menu icon. It will look like 3 horizontal lines when menu is closed and like cross when menu is opened
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
                    transform: openMenu ? "translateY(24.167em)" : "translateY(0)", //if mobile view, hide link at the top of screen to then animate their slide down
                } : null}>
                    {/* pc screen size navbar links view */}
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
                        // mobile screen sizes navbar links view
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


