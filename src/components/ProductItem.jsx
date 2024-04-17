import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ref, set, get } from 'firebase/database';
import { auth } from '/src/firebase-config.jsx'
import { getDatabase } from 'firebase/database';

const ProductItem = ({ product, onError }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const db = getDatabase();

    const addToCart = async (product) => {
        const user = auth.currentUser;
        if (user) {
            const cartRef = ref(db, `carts/${user.uid}`);
            const snapshot = await get(cartRef);
            const existingCartItems = snapshot.val() || {};      
            const productExists = product.id in existingCartItems;
        
            if (!productExists) {
                await set(ref(db, `carts/${user.uid}/${product.id}`), {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    techSpecs: product.techSpecs ? product.techSpecs : {},
                    price: parseInt(product.price),
                    mainPicture: product.mainPicture || product.pictures[0],
                    quantity: 1
                });
                onError('Product added to cart', true, true);
            } else {
                onError('Product is already in the cart', true, false);
            }
        } else {
            onError('Please log in first', true, false);
        }
    };

    return (
        <>
        <div className="grid-item">
            <Link className='linkContainer' to={`/products/${product.id}`}>
                <img 
                    className="picture" 
                    src={product.mainPicture || product.pictures[0]} 
                    alt={product.name} 
                    onLoad={() => setImageLoaded(true)}
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                />
            </Link>
            {!imageLoaded && <p className='loadingDisk'></p>}
            <div className="productInfo">
                <div className="topOfContainer">
                    <p className='name'>{product.name}</p>
                    <p className='description'>{product.description}</p>
                </div>
                <div className="bottomOfContainer">
                    <p className='price'>US${product.price}</p>
                    <button onClick={() => addToCart(product)}>Add to cart</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default ProductItem;
