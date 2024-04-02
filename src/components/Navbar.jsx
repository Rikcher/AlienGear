import { Outlet, Link, useNavigate } from "react-router-dom";
import '/src/styles/css/Navbar.css'
import { auth } from '/src/firebase-config.jsx';

const Navbar = () => {
    const user = auth.currentUser;
    const navigate = useNavigate();

    const signInOrProfileLink = user ? "/profile" : "/sign-in";

    const handleSignInOrProfileClick = () => {
        if (user) {
            navigate("/profile");
        } else {
            navigate("/sign-in");
        }
    };

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
                    <Link to="#" className="button">
                        <img className="buttonAnimate product" src="/navbar/ProductButtonBackground.svg" alt="" />
                        <p className="link text">PRODUCTS</p>
                    </Link>
                    <Link to="/about-us" className="button">
                        <img className="buttonAnimate aboutus" src="/navbar/AboutUsButtonBackground.svg" alt="" />
                        <p className="link text">ABOUT US</p>
                    </Link>
                    <Link to={signInOrProfileLink} className="button" onClick={handleSignInOrProfileClick}>
                        <img className="buttonAnimate user" src="/navbar/UserButtonBackground.svg" alt="" />
                        <div className="link icon user">
                            <div></div>
                        </div>
                    </Link>
                    <Link to="#" className="button">
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

