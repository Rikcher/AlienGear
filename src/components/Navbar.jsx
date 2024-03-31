import { Outlet, Link } from "react-router-dom";
import '/src/styles/css/Navbar.css'


const Navbar = () => {
    return ( 
        <>
        <header>
            <nav>
                <img id="navbarLogo" src="/navbar/NavbarAppIcon.svg" alt="AlienGear logo" />
                <div className="navLinks">
                    <div className="button">
                        <img className="buttonAnimate home" src="/navbar/HomeButtonBackground.svg" alt="" />
                        <Link className="link text" to="/">HOME</Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate product" src="/navbar/ProductButtonBackground.svg" alt="" />
                        <Link className="link text" to="#">PRODUCTS</Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate aboutus" src="/navbar/AboutUsButtonBackground.svg" alt="" />
                        <Link className="link text" to="/about-us">ABOUT US</Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate user" src="/navbar/UserButtonBackground.svg" alt="" />
                        <Link className="link icon user" to="/sign-in">
                            <div></div>
                        </Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate cart" src="/navbar/CartButtonBackground.svg" alt="" />
                        <Link className="link icon cart" to="#">
                            <div></div>
                        </Link>
                    </div>
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
