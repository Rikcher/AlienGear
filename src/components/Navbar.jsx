import { Outlet, Link } from "react-router-dom";
import '/src/styles/css/Navbar.css'


const Navbar = () => {
    return ( 
        <>
        <header>
            <nav>
                <img id="navbarLogo" src="/public/NavbarAppIcon.svg" alt="" />
                <div className="navLinks">
                    <div className="button">
                        <img className="buttonAnimate home" src="/public/HomeButtonBackground.svg" alt="" />
                        <Link className="link text" to="/">HOME</Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate product" src="/public/ProductButtonBackground.svg" alt="" />
                        <Link className="link text" to="#">PRODUCTS</Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate aboutus" src="/public/AboutUsButtonBackground.svg" alt="" />
                        <Link className="link text" to="/about-us">ABOUT US</Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate user" src="/public/UserButtonBackground.svg" alt="" />
                        <Link className="link icon user" to="#">
                            <div></div>
                        </Link>
                    </div>
                    <div className="button">
                        <img className="buttonAnimate cart" src="/public/CartButtonBackground.svg" alt="" />
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
