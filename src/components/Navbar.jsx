import { Outlet, Link } from "react-router-dom";
import '/src/styles/css/Navbar.css'
import { auth } from '/src/firebase-config.jsx';
import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [user, setUser] = useState(auth.currentUser);


    useEffect(() => {
        // Listen for changes in the user's authentication status
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
        });

        // Cleanup the subscription on component unmount
        return () => unsubscribe();
    }, []);

    return ( 
        <>
        <header>
            <nav>
                <img id="navbarLogo" src="/navbar/NavbarAppIcon.svg" alt="AlienGear logo" />
                <div className="navLinks">
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
                        </div>
                    </Link>
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

