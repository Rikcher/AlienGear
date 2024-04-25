import React from 'react';
import { Link } from 'react-router-dom';
import'/src/styles/css/ProductPlaceholder.css'

const ProductPlaceholder = () => {
    return (
        <div className="grid-item placeholder">
            <Link className='linkContainer' to={`#`}>
                <div className="picture"></div>
            </Link>
            <div className="productInfo">
                <div className="topOfContainer">
                    <p className='name placeholder-text'></p>
                    <p className='description placeholder-text'></p>
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
