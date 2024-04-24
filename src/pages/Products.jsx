import'/src/styles/css/Products.css'
import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import ProductPlaceholder from '/src/components/ProductPlaceholder.jsx'
import ProductItem from '/src/components/ProductItem.jsx'

const Products = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null); 
    const [sortingMethod, setSortingMethod] = useState('default'); 
    const [customPriceRange, setCustomPriceRange] = useState({ min: "", max: "" });
    const [activeFilter, setActiveFilter] = useState('default');
    const [isFilterFunctionalityVisible, setIsFilterFunctionalityVisible] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth); 
    const filterFunctionalityRef = useRef(null);
    const db = getDatabase();

    const [isVisible, setIsVisible] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [isBlue, setIsBlue] = useState(false);
    const [shake, setShake] = useState(false)
    const [hasBeenShown, setHasBeenShown] = useState(false);

    //handle message functionality that product item is passing
    const handleError = (text, isVisible, isBlue) => {
        setErrorText(text);
        setIsVisible(isVisible);
        setIsBlue(isBlue);
        setHasBeenShown(true);
        // Check if the error message has been shown at least once
        if (hasBeenShown && isVisible) {
            setShake(true);
            setTimeout(() => {
                setShake(false);
            }, 500);
        }
    };

    //clear message after 5s
    useEffect(() => {
        if (errorText) {
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

    //fetch products to display from sb
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

    //after user logs in he redirected to products page and this message will be triggered
    useEffect(() => {
        if (location.state && location.state.justLogedIn) {
            handleError("You successfully logged in", true, true)
        }
    }, [location]);

    //when opening filter popout, listen for click outside of it. If clicked outside, close popout
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isFilterFunctionalityVisible && filterFunctionalityRef.current) {
                // Check if the clicked element is not the filterFunctionality div or a descendant of it
                if (
                    (filterFunctionalityRef.current !== event.target && !filterFunctionalityRef.current.contains(event.target)) || // Click outside filter functionality
                    (event.target.classList.contains('iconOver')) // If clicked on icon again, close popout
                ) {
                    setIsFilterFunctionalityVisible(false);
                }
            }
        };
        
    
        // Add the event listener to the document
        document.addEventListener('mousedown', handleClickOutside);
    
        // Cleanup the event listener when the component unmounts or when dependencies change
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterFunctionalityVisible, filterFunctionalityRef]);


    // Function to handle category filter
    const handleCategoryFilter = (category) => {
        setSelectedCategory(category); //filter displayed products by chosen category
        setActiveFilter('default') //reset specific product filter like "wired" or "wireless" when category changes
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategory ? products.filter(product => product.category === selectedCategory) : products;

    //reset custom price filter
    const resetCustomPriceRange = () => {
        setCustomPriceRange(prevState => ({
            ...prevState,
            min: "",
            max: ""
        }));
    }

    //set sorting method to HighToLow and reset custom price sort
    const handleSortHighToLow = () => {
        setSortingMethod(sortingMethod === 'highToLow' ? 'default' : 'highToLow');
        resetCustomPriceRange()
    };
    
    //set sorting method to LowToHigh and reset custom price sort
    const handleSortLowToHigh = () => {
        setSortingMethod(sortingMethod === 'lowToHigh' ? 'default' : 'lowToHigh');
        resetCustomPriceRange()
    };

    //set sorting method to custom prices that user choosed
    const handleCustomPriceRange = () => {
        setSortingMethod(sortingMethod === 'custom' ? 'default' : 'custom');
        };
    

    //array that will be displayed, sorted and filtered
    const sortedProducts = [...filteredProducts]
    .filter(product => {
        // If there's no active filter, include all products
        if (activeFilter === 'default') return true;

        // Check if the product's category matches the active filter
        return product.filter === activeFilter;
    })
    .filter(product => {
        if (customPriceRange.min > 0 && product.price < customPriceRange.min) {
            return false;
        }
        if (customPriceRange.max > 0 && product.price > customPriceRange.max) {
            return false;
        }
        return true;
    })
    .sort((a, b) => {
        if (sortingMethod === 'highToLow') {
            return b.price - a.price;
        } else if (sortingMethod === 'lowToHigh') {
            return a.price - b.price;
        }
        return 0; // Default or no sorting
    });
    

    //filter toggle functionality
    const toggleFilter = (filter) => {
        setActiveFilter(prevFilter => prevFilter === filter ? 'default' : filter);
    };

    return ( 
        <div className='productsPageWrapper'>
            <div className='productsNavBar'>
                <div className="buttons all" onClick={() => handleCategoryFilter(null)}>
                    <div className="icon all"></div>
                    <p className="text">All</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('mice')}>
                    <div className="icon mice"></div>
                    <p className="text">Mice</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('keyboards')}>
                    <div className="icon keyboards"></div>
                    <p className="text">Keyboards</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('chairs')}>
                    <div className="icon chairs"></div>
                    <p className="text">Chairs</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('pads')}>
                    <div className="icon pads"></div>
                    <p className="text">Pads</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('headsets')}>
                    <div className="icon headsets"></div>
                    <p className="text">Headsets</p>
                </div>
                <div className="buttons" onClick={() => handleCategoryFilter('controllers')}>
                    <div className="icon controllers"></div>
                    <p className="text">Controllers</p>
                </div>
                {/* on mobile, filter popout will be placed fixed on viewport with 100vh and slide from right side */}
                {screenWidth <= 1024 && (
                    <div 
                    className="filterFunctionality"
                    ref={filterFunctionalityRef}
                    style={screenWidth <= 1024  ? {
                        transform: isFilterFunctionalityVisible ? "translateX(-86vw)" : "translateX(0)",
                    } : null}
                    >
                        <div className="iconOver"></div>
                        <div className="sortBy">
                            <p className='title'>Sort by</p>
                            <div className="priceFilters">
                                <button onClick={handleSortHighToLow} className={`HtL ${sortingMethod === 'highToLow' ? 'active' : ''}`}>Price: High to Low</button>
                                <button onClick={handleSortLowToHigh} className={`ltH ${sortingMethod === 'lowToHigh' ? 'active' : ''}`}>Price: Low to High</button>
                                <button className={`custom ${sortingMethod === 'custom' ? 'active' : ''}`}>
                                    <p onClick={() => {
                                        handleCustomPriceRange();
                                        resetCustomPriceRange();
                                    }}className='localTitlte'>Price: Custom</p>
                                    {sortingMethod === 'custom' ? (
                                        <div className='cutsomPriceInputs'>
                                            <div>
                                                <p className="from">From</p>
                                                <input 
                                                onChange={(e) => {
                                                    setCustomPriceRange(prevState => ({
                                                        ...prevState,
                                                        min: e.target.value
                                                    }));
                                                }}
                                                value={customPriceRange.min}
                                                placeholder='0' 
                                                type="number" />
                                            </div>
                                            <div>
                                                <p className="to">To</p>
                                                <input 
                                                placeholder='0'
                                                type="number"
                                                value={customPriceRange.max}
                                                onChange={(e) => {
                                                    setCustomPriceRange(prevState => ({
                                                        ...prevState,
                                                        max: e.target.value
                                                    }));
                                                }}
                                                />
                                            </div>
                                        </div>
                                    ) : null}
                                </button>
                            </div>

                        </div>
                        <div className="productFilter">
                            <p className="title">Product filter</p>
                            <p className="filterName">{selectedCategory}</p>
                            {selectedCategory ? (
                            <div className="specificFiltersContainer">
                                {filteredProducts.reduce((acc, product) => {
                                if (product.filter && !acc.includes(product.filter)) {
                                    acc.push(product.filter);
                                }
                                return acc;
                                }, []).length > 0 ? (
                                filteredProducts.reduce((acc, product) => {
                                    if (product.filter && !acc.includes(product.filter)) {
                                    acc.push(product.filter);
                                    }
                                    return acc;
                                }, []).map((filter, index) => (
                                    <p key={index} className={`specificFilter ${activeFilter === filter ? 'active' : ''}`} onClick={() => toggleFilter(filter)}>{filter}</p>
                                ))
                                ) : (
                                <p className="noFilter">No filters</p>
                                )}
                            </div>
                            ) : (
                            <p className='noCategory'>Choose specific product first</p>
                            )}
                        </div>
                    </div>
                )}
                <div className="buttons filter" onClick={() => setIsFilterFunctionalityVisible(true)}>
                    <div className="icon filter"></div>
                    <p className="text">Filter</p>
                    {isFilterFunctionalityVisible && screenWidth > 1024 && (
                        <div className="filterFunctionality" ref={filterFunctionalityRef}>
                            <div className="iconOver"></div>
                            <div className="sortBy">
                                <p className='title'>Sort by</p>
                                <div className="priceFilters">
                                    <button onClick={handleSortHighToLow} className={`HtL ${sortingMethod === 'highToLow' ? 'active' : ''}`}>Price: High to Low</button>
                                    <button onClick={handleSortLowToHigh} className={`ltH ${sortingMethod === 'lowToHigh' ? 'active' : ''}`}>Price: Low to High</button>
                                    <button className={`custom ${sortingMethod === 'custom' ? 'active' : ''}`}>
                                        <p onClick={() => {
                                            handleCustomPriceRange();
                                            resetCustomPriceRange();
                                        }}className='localTitlte'>Price: Custom</p>
                                        {sortingMethod === 'custom' ? (
                                            <div className='cutsomPriceInputs'>
                                                <div>
                                                    <p className="from">From</p>
                                                    <input 
                                                    onChange={(e) => {
                                                        setCustomPriceRange(prevState => ({
                                                            ...prevState,
                                                            min: e.target.value
                                                        }));
                                                    }}
                                                    value={customPriceRange.min}
                                                    placeholder='0' 
                                                    type="number" />
                                                </div>
                                                <div>
                                                    <p className="to">To</p>
                                                    <input 
                                                    placeholder='0'
                                                    type="number"
                                                    value={customPriceRange.max}
                                                    onChange={(e) => {
                                                        setCustomPriceRange(prevState => ({
                                                            ...prevState,
                                                            max: e.target.value
                                                        }));
                                                    }}
                                                    />
                                                </div>
                                            </div>
                                        ) : null}
                                    </button>
                                </div>

                            </div>
                            <div className="productFilter">
                                <p className="title">Product filter</p>
                                <p className="filterName">{selectedCategory}</p>
                                {selectedCategory ? (
                                <div className="specificFiltersContainer">
                                    {filteredProducts.reduce((acc, product) => {
                                    if (product.filter && !acc.includes(product.filter)) {
                                        acc.push(product.filter);
                                    }
                                    return acc;
                                    }, []).length > 0 ? (
                                    filteredProducts.reduce((acc, product) => {
                                        if (product.filter && !acc.includes(product.filter)) {
                                        acc.push(product.filter);
                                        }
                                        return acc;
                                    }, []).map((filter, index) => (
                                        <p key={index} className={`specificFilter ${activeFilter === filter ? 'active' : ''}`} onClick={() => toggleFilter(filter)}>{filter}</p>
                                    ))
                                    ) : (
                                    <p className="noFilter">No filters</p>
                                    )}
                                </div>
                                ) : (
                                <p className='noCategory'>Choose specific product first</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* container for all products to display */}
            <div className="productsContainer">
                {/* while products are loading and sorting show placeholders */}
                {sortedProducts.length > 0 ? (
                    sortedProducts.map(product => (
                        <ProductItem key={product.id} product={product} onError={handleError} />
                    ))
                ) : (
                    // placeholders fpr products
                    Array(30).fill().map((_, index) => <ProductPlaceholder key={index} />)
                )}
            </div>
            {/* message functionality to show errors and other messages */}
            <div className={`errorMessage ${isBlue ? 'blue' : ''} ${isVisible ? 'show' : ''} ${shake ? 'shake' : ''}`}>{errorText}</div>
        </div>
    );
}

export default Products;
