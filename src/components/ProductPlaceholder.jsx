import React, { useEffect, useState} from 'react';
import'/src/styles/css/ProductPlaceholder.css'

const ProductPlaceholder = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); // State to track screen width


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
        <div className="grid-item placeholder">
            <div className="picture-placeholder"></div>
            <div className="productInfo">
                <div className="topOfContainer">
                    <p className='name placeholder-text'></p>
                    <p className='description placeholder-text'></p>
                    {screenWidth >= 1024 && (
                    <p className='description2 placeholder-text'></p>
                    )}
                </div>
                <div className="bottomOfContainer">
                    <p className='price placeholder-text'></p>
                    <button className="add-to-cart-placeholder">Add to cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPlaceholder;
