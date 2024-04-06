import'/src/styles/css/Products.css'
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Link, useNavigate } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); // State to keep track of selected category
    const db = getDatabase();

    useEffect(() => {
        const fetchProducts = () => {
            const dbRef = ref(db, 'products');
            onValue(dbRef, (snapshot) => {
                const productsData = snapshot.val();
                const productsList = [];

                for (const category in productsData) {
                    if (category === 'pads') {
                        const padsData = productsData[category];
                        for (const pictureId in padsData.pictures) {
                            const id = `${category}-${pictureId}`;
                            const mainPicture = padsData.pictures[pictureId]
                            productsList.push({ ...padsData, id, mainPicture, category });
                        }
                    } else {
                        const categoryData = productsData[category];
                        for (const itemId in categoryData) {
                            const id = `${category}-${itemId}`;
                            const item = categoryData[itemId];
                            let price = item.price;
                            if (!price.toString().includes('.')) {
                                price = parseFloat(price).toFixed(2);
                            }
                            const otherPictures = item.otherPictures ? Object.values(item.otherPictures) : [];
                            const stats = item.stats ? Object.values(item.stats) : [];
                            productsList.push({ ...item, id, price, otherPictures, stats, category });
                        }
                    }
                }

                setProducts(productsList);
            });
        };

        fetchProducts();
    }, []);

    // Function to handle category filter
    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;

    return ( 
        <div className='productsPageWrapper'>
            <div className='productsNavBar'>
                <div className="buttons all" onClick={() => handleCategoryFilter(null)}>
                    <div className="icon all"></div>
                    <p>All</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('mice')}>
                    <div className="icon mice"></div>
                    <p>Mice</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('keyboards')}>
                    <div className="icon keyboards"></div>
                    <p>Keyboards</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('chairs')}>
                    <div className="icon chairs"></div>
                    <p>Chairs</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('pads')}>
                    <div className="icon pads"></div>
                    <p>Pads</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('headsets')}>
                    <div className="icon headsets"></div>
                    <p>Headsets</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('controllers')}>
                    <div className="icon controllers"></div>
                    <p>Controllers</p>
                </div>
                <div className="buttons filter">
                    <div className="icon filter"></div>
                    <p>Filter</p>
                </div>
            </div>
            {/* ******************************************************************************* */}
            <div className="productsContainer">
            {filteredProducts.map(product => (
                <div key={product.id} className="grid-item">
                    <Link to={`/products/${product.id}`}>
                        <img className='picture' src={product.mainPicture || product.pictures[0]} alt={product.name} />
                    </Link>
                    <div className="productInfo">
                        <div className="topOfContainer">
                            <p className='name'>{product.name}</p>
                            <p className='description'>{product.description}</p>
                        </div>
                        <div className="bottomOfContainer">
                            <p className='price'>US${product.price}</p>
                            <button>Add to cart</button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}

export default Products;
