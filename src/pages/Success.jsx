import { Link } from 'react-router-dom';
import { auth } from '/src/firebase-config.jsx';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import '/src/styles/css/Success.css'

const Success = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Update user state
        });

        // Clean up the observer when the component unmounts
        return () => unsubscribe();
    }, []);
    
    // Clear cart after checkout
    useEffect(() => {
        if (user) {
            const database = getDatabase();
            const deleteRef = ref(database, `carts/${user.uid}/`);
            remove(deleteRef)
                .then(() => console.log('Cart cleared successfully'))
                .catch((error) => console.error('Error clearing cart:', error));
        }
    }, [user]); // Add user as a dependency to re-run this effect when user changes

    return ( 
        <div className="successPageWrapper">
            <div className='successIcon'></div>
            <h2>Thank you for your purchase!</h2>
            <Link className='button' to="/products">Shop more</Link>
        </div>
    );
}

export default Success;