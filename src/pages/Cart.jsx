import '/src/styles/css/Cart.css'
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { loadStripe } from '@stripe/stripe-js'; 

const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PK);

const Cart = () => {
    const [products, setProducts] = useState([]);


    //func to buy items
    const handleBuy = async () => {

        const stripe = await stripePromise;
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products }),
        });
    
        const session = await response.json();
        console.log('Response:', session);
    
        // Redirect to Stripe checkout page
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
    
        if (result.error) {
            console.error(result.error.message);
        }
    };

    useEffect(() => {
    const fetchProducts = async () => {
        try {
        const database = getDatabase(); // Get the database instance
        const productsRef = ref(database, 'products/mice/wired'); // Use ref function to create a reference to the location in the database
        onValue(productsRef, (snapshot) => {
            const productsData = snapshot.val();
            if (productsData) {
            const productsArray = Object.values(productsData).map(product => ({
                description: product.description,
                name: product.name,
                picture: product.picture,
                price: product.price
            }));
            setProducts(productsArray);
            }
        });
        } catch (error) {
        console.error('Error fetching products:', error);
        }
    };

    fetchProducts();
    }, []);

    return (
    <div className='cartPageWrapper'>
        <h2>Cart</h2>
        <button onClick={handleBuy}>Buy</button>
        <ul>
        {products.map(product => (
            <li key={product.name}>
            <div>Name: {product.name}</div>
            <div>Price: {product.price}</div>
            <div>Description: {product.description}</div>
            <img src={product.picture} alt={product.name} />
            {/* Add other product details as needed */}
            </li>
        ))}
        </ul>
    </div>
    );
}

export default Cart;