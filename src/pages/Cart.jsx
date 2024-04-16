import '/src/styles/css/Cart.css'
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { auth } from '/src/firebase-config.jsx';
import { loadStripe } from '@stripe/stripe-js'; 

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PK);

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({}); // State to track quantity of each product
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [isVisible, setIsVisible] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [shake, setShake] = useState(false)


    // func to buy items
    const handleBuy = async () => {
        if (!user) {
            if (isVisible) {
                setErrorText('Please log in first')
                setShake(true);
                // After a short delay, remove the shake class
                setTimeout(() => {
                    setShake(false);
                }, 500);
                return
            } else {
                setErrorText('Please log in first')
                return
            }
        }

        const stripe = await stripePromise;
        const productsWithQuantities = products.map(product => ({
            ...product,
            quantity: quantities[product.id] || 1, // Use the quantity from state, default to 1 if not found
        }));

        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: productsWithQuantities }),
        });
    
        const session = await response.json();
    
        // Redirect to Stripe checkout page
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
    };

    useEffect(() => {
        const fetchCartItems = async (user) => {
            try {
                if (user) {
                    const database = getDatabase();
                    const cartRef = ref(database, `carts/${user.uid}`);
                    onValue(cartRef, (snapshot) => {
                        const cartData = snapshot.val();
                        if (cartData) {
                            // Convert the cart object into an array
                            const cartItemsArray = Object.values(cartData);
                            setProducts(cartItemsArray);

                            // Initialize quantities for each item
                            const initialQuantities = cartItemsArray.reduce((acc, item) => ({
                                ...acc,
                                [item.id]: item.quantity
                            }), {});
                            setQuantities(initialQuantities);
                        }
                        setLoading(false);
                    });
                }
            } catch (error) {
                if (isVisible) {
                    setErrorText('Error fetching cart items')
                    setShake(true);
                    // After a short delay, remove the shake class
                    setTimeout(() => {
                        setShake(false);
                    }, 500);
                    setLoading(false);
                    return
                } else {
                    setErrorText('Error fetching cart items')
                    setLoading(false);
                    return
                }
            }
            
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Update user state
            if (user) {
                fetchCartItems(user); // Fetch cart items if the user is logged in
            } else {
                setProducts([]);
                setQuantities({});
                setLoading(false); // Set products to an empty array if the user is logged out
            }
        });

        // Clean up the observer when the component unmounts
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (errorText) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    setIsBlue(false);
                }, 100) // delay for 0.1s so it doesnt flicker back to red instantly as it disappears
                setErrorText("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorText]);

    const updateQuantityInDatabase = async (productId, newQuantity) => {
        try {
            const database = getDatabase();
            const quantityRef = ref(database, `carts/${user.uid}/${productId}`);
            await update(quantityRef, { quantity: newQuantity });
        } catch (err) {
            console.log(err);
        }
    };
    

    const handleQuantityChange = (productId, change) => {
        setQuantities(prevQuantities => {
            const newQuantity = (prevQuantities[productId] || 0) + change;
            // Ensure the new quantity is within the allowed range (1 to 9)
            if (newQuantity < 1) {
                return { ...prevQuantities, [productId]: 1 };
            } else if (newQuantity > 9) {
                return { ...prevQuantities, [productId]: 9 };
            } else {
                // Call the async function to update the database
                updateQuantityInDatabase(productId, newQuantity).then(() => {
                    // Update the state after the database update is successful
                    setQuantities(prevQuantities => ({
                        ...prevQuantities,
                        [productId]: newQuantity
                    }));
                }).catch(error => {
                    console.error('Error updating quantity in database:', error);
                });
    
                // Return the previous state to avoid immediate state update
                return prevQuantities;
            }
        });
    };
    

    const handleDeleteProduct = async (productId) => {
        try {
            if (user) {
                const database = getDatabase();
                const deleteRef = ref(database, `carts/${user.uid}/${productId}`);
                await remove(deleteRef) ;
                if (products.length === 1) {
                    // If the last item is being deleted, update the state to reflect an empty cart
                    setProducts([]);
                    setQuantities({});
                }
                // You may also want to update the UI accordingly by refetching the cart items
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const totalPrice = products.reduce((sum, product) => sum + product.price * (quantities[product.id] || 0), 0);

    const totalItemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);


    return (
        <div className='cartPageWrapper'>
            <div className="leftPanel">
                <h2 className="cartTitle">Shopping Cart</h2>
                <p className="priceLine">Price</p>
                {loading ? ( // Show loading indicator if products is null
                    <p className='loadingDisk'></p>
                ) : (
                    products && products.length > 0 ? (
                        products.map((product, index) => (
                            <div className="item" key={index}>
                                <img src={product.mainPicture} alt="" className="itemPicture" />
                                <div className="itemInfo">
                                    <p className="name">{product.name}</p>
                                    <p className="description">{product.description}</p>
                                    <div className="techSpecs">
                                        <h4 className="techSpecsTitle">Tech Specs</h4>
                                        {product.techSpecs ? (
                                        Object.entries(product.techSpecs).map(([key, value]) => (
                                            <div className="pair" key={key}>
                                                <p className="key">{key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() + ':'}</p>
                                                <p className="value">{value}</p>
                                            </div>
                                        ))
                                        ) : (
                                            <>
                                                <div className="pair">
                                                    <p className="key">Size</p>
                                                    <p className="value">{product.id.slice(-1) <= 5 ? "Large" : "Medium"}</p>
                                                </div>
                                                <div className="pair">
                                                    <p className="key">Material</p>
                                                    <p className="value">{product.id.slice(-1) <= 5 ? "Premium Leather" : "Silicone"}</p>
                                                </div>
                                                <div className="pair">
                                                    <p className="key">Thickness</p>
                                                    <p className="value">{product.id.slice(-1) <= 5 ? "2mm" : "1.5mm"}</p>
                                                </div>
                                                <div className="pair">
                                                    <p className="key">Weight</p>
                                                    <p className="value">{product.id.slice(-1) <= 5 ? "200g" : "150g"}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="buttons">
                                        <div className="qty">
                                            <div className="minus" onClick={() => handleQuantityChange(product.id, -1)}>
                                                <div></div>
                                            </div>
                                            <p className='text'>{`Qty: ${quantities[product.id] || 0}`}</p>
                                            <div className='plus' onClick={() => handleQuantityChange(product.id, 1)}>
                                                <div className='vertical'></div>
                                                <div className='horizontal'></div>
                                            </div>
                                        </div>
                                        <div className="delete" onClick={() => handleDeleteProduct(product.id)}>Delete</div>
                                        <div className="share">Share</div>
                                    </div>
                                </div>
                                <p className="price">{`US$${product.price.toFixed(2)}`}</p>
                            </div>
                        ))
                        ) : (
                            <p className='empty'>Your shopping cart is empty</p>
                        )
                    )}
                <div className="subtotal">Subtotal({auth.currentUser ? totalItemCount : "0"} items): <span className='boldPrice'>US${auth.currentUser ? totalPrice.toFixed(2) : "0"}</span></div>
            </div>
            <div className="rightPanel">
                <div className="subtotal">Subtotal({auth.currentUser ? totalItemCount : "0"} items): <span className='boldPrice'>US${auth.currentUser ? totalPrice.toFixed(2) : "0"}</span></div>
                <div onClick={handleBuy} className="checkoutButton">Proceed to checkout</div>
            </div>

            <div className={`errorMessage ${isVisible ? 'show' : ''} ${shake ? 'shake' : ''}`}>{errorText}</div>
        </div>
    );
    
}

export default Cart;