import '/src/styles/css/AboutUs.css'
import React, { useEffect, useState } from 'react';

const AboutUs = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

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
    return ( 
        <div className="aboutUsWrapper">
            {/* if screen width is bigger than 1024px place ufo image beside text */}
            {screenWidth > 1024 && (
            <div id='aboutUsPageUfo'></div>
            )}
            <div className="text">
                <div className="importantNotice">
                    <h2 className="aboutUsPageTitle">Important Notice: Non-Commercial Use Only</h2>
                    <p className='paragraph'>I would like to clarify that this website is intended for non-commercial use only. This means that the content and resources available on this site are not to be used for any form of commercial activity, including but not limited to selling products, services, or any other commercial ventures.</p>
                    <p className='paragraph'>The primary purpose of this website is to provide a glimpse into my capabilities as a web developer, specifically in the realm of online shopping. It aims to demonstrate how I can leverage my skills to create online stores that are tailored to meet the needs of businesses and individuals looking to establish a strong online presence.</p>
                    <p className='paragraph'>Thank you for visiting, and I hope you find this showcase of my work both informative and useful.</p>
                </div>
                {/* if screen width is smaller than 1024px place ufo image at the top of social icons */}
                {screenWidth <= 1024 && (
                <div id='aboutUsPageUfo'></div>
                )}
                <div className="contactUs">
                    <h3>Feel free to contact me</h3>
                    <a id='email' href="mailto:nick.richardson.4884@gmail.com"></a>
                    <a id='twitter' href="https://twitter.com/4Rikcher"></a>
                    <a id='github' href="https://github.com/Rikcher"></a>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
