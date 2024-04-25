import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ref, set, get } from 'firebase/database';
import { auth } from '/src/firebase-config.jsx'
import { getDatabase } from 'firebase/database';

const ProductItem = ({ product, onError }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [inCartIcon, setInCartIcon] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const db = getDatabase();

    //check if item in cart and add icon to it if it is
    useEffect(() => {
        const checkProductInCart = async () => {
            const user = auth.currentUser;
            if (user) {
                const cartRef = ref(db, `carts/${user.uid}`);
                const snapshot = await get(cartRef);
                const existingCartItems = snapshot.val() || {};      
                const productExists = product.id in existingCartItems;
                if (productExists) {
                    setInCartIcon(true);
                }
            }
        };

        checkProductInCart();
    }, [product.id]); // Depend on product.id to re-run the effect when the product changes


    //handle add to cart button click event
    const addToCart = async (product) => {
        const user = auth.currentUser;
        if (user) {
            const cartRef = ref(db, `carts/${user.uid}`);
            const snapshot = await get(cartRef);
            const existingCartItems = snapshot.val() || {};      
            const productExists = product.id in existingCartItems;
            
            //if product not in cart, add it
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
                setInCartIcon(true)
                onError('Product added to cart', true, true); //trigger message
            } else {
                onError('Product is already in the cart', true, false);
            }
        } else {
            onError('Please log in first', true, false);
        }
    };



    return (
        <>
        <div className="grid-item" style={{backgroundColor: isHovered ? "#021410" : "#0A0A0A"}}>
            <Link onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='linkContainer' to={`/products/${product.id}`}>
                {inCartIcon ? (
                    <div className='inCartIcon'></div>
                ) : null}
                <img 
                    className="picture" 
                    src={product.mainPicture || product.pictures[0]} 
                    alt={product.name} 
                    onLoad={() => setImageLoaded(true)}
                    style={{ 
                        display: imageLoaded ? 'block' : 'none'
                    }}
                />
            </Link>
            {/* show loading disk while picture loading */}
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
