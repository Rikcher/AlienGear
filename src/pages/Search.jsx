import '/src/styles/css/Search.css'
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue} from 'firebase/database';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilter, setSearchFilter] = useState({category: "", type: "", name: ""})
    const [suggestions, setSuggestions] = useState([]); // New state for suggestions
    const db = getDatabase();
    const categoriesToCheck = ["mouse", "keyboard", "pad", "headset", "controller", "chair"];
    const typesToCheck = ["wired", "wireless"];
    const namesToCheck = ["gigantus", "deathadder", "cobra", "basilisk", "viper", "naga", "huntsman", "blackWidow", "deathStalker", "type", "blackShark", "kraken", "barracuda", "wolverine", "iskur", "enki"];
    const propertyUpdates = {
        type: typesToCheck,
        category: categoriesToCheck,
        name: namesToCheck
    };
    const [filteredItems, setFilteredItems] = useState([])
    const inputRef = useRef(null);
    
    useEffect(() => {
        // Reset searchFilter to its initial state
        setSearchFilter({category: "", type: "", name: ""});

        // This effect runs when the component mounts and whenever searchQuery changes
        searchQuery.toLowerCase().split(" ").filter(word => {
            Object.entries(propertyUpdates).forEach(([property, words]) => {
                if (words.includes(word)) {
                    setSearchFilter(prevState => ({
                        ...prevState,
                        [property]: word
                    }));
                }
            });
        });
    }, [searchQuery]); // Dependency array: the effect runs when searchQuery changes

    async function searchProducts(db, searchFilter) {
        let results = [];

        // Reference to the products in the database
        const productsRef = ref(db, 'products');

        // Function to handle the data snapshot
        const handleDataSnapshot = (snapshot) => {
            const data = snapshot.val();

            if (data) {

                const capitalizeFirstLetter = (string) => {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                };

                const generateItemId = (category, itemId) => {
                    return `${category}-${itemId}`;
                };

                Object.entries(data).forEach(([category, items]) => {
                    // Iterate over each item in the category
                    if ((searchFilter.category === "pad" && `${items.description}`.toLocaleLowerCase().includes(searchFilter.category)) || (searchFilter.name === "gigantus" && `${items.name}`.toLocaleLowerCase().includes(searchFilter.name))) {
                        for (const pictureId in data.pads.pictures) {
                            const id = `pads-${pictureId}`;
                            const mainPicture = data.pads.pictures[pictureId]
                            results.push({ ...data.pads, id, mainPicture });
                        }
                    } else {
                        Object.keys(items).forEach((itemId) => {
                            const item = items[itemId];
                            // Check if the item name matches the search filter
                            if(searchFilter.name != '') {
                                if (item && item.name && item.name.toLowerCase().includes(searchFilter.name)) {
                                    const id = generateItemId(category, itemId);
                                    // Push the item with its ID into the results array
                                    results.push({ ...item, id });
                                }
                            } else if (searchFilter.type != '' && searchFilter.category != '') {
                                if (`${item.description}`.includes(capitalizeFirstLetter(searchFilter.category))) {
                                    if (item && item.filter && `${item.filter}`.includes(searchFilter.type)) {
                                        const id = generateItemId(category, itemId);
                                        // Push the item with its ID into the results array
                                        results.push({ ...item, id });
                                    }
                                }
                            } else if (searchFilter.type != '') {
                                if (item && item.filter && `${item.filter}`.includes(searchFilter.type)) {
                                    const id = generateItemId(category, itemId);
                                    // Push the item with its ID into the results array
                                    results.push({ ...item, id });
                                }
                            } else if (searchFilter.category != '') { 
                                if (`${item.description}`.includes(capitalizeFirstLetter(searchFilter.category))) {
                                    const id = generateItemId(category, itemId);
                                    // Push the item with its ID into the results array
                                    results.push({ ...item, id });
                                }
                            }
                        });
                    }
                });
            }
        };

        // Listen for changes in the products data
        onValue(productsRef, handleDataSnapshot);

        // Return the results
        return results;
    }

    useEffect(() => {
        (async () => {
            const results = await searchProducts(db, searchFilter);
            setFilteredItems(results); // Directly set filteredItems to results
        })();
    }, [searchFilter]); // Dependency array: the effect runs when searchFilter changes

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    
        // Initialize suggestions array
        let filteredSuggestions = [];
    
        // Split the query into words
        const queryWords = query.split(" ");
        // Check if searchFilter.type is not an empty string
        if (searchFilter.type !== "" && queryWords.length > 1) {
            const filteredBasedOnQuery = categoriesToCheck.filter(word => {
                if (!word.startsWith("pad") && !word.startsWith("chair")) {
                    return word.startsWith(queryWords[1])
                }
            });
            filteredSuggestions = filteredBasedOnQuery.map(word => `${searchFilter.type} ${word}`);
        } else if (searchFilter.category !== "" && searchFilter.category !== "pad" && searchFilter.category !== "chair" && queryWords.length > 1) {
            const filteredBasedOnQuery = typesToCheck.filter(word => word.startsWith(queryWords[1]));
            filteredSuggestions = filteredBasedOnQuery.map(word => `${searchFilter.category} ${word}`);
        } else if (query !== "") {
            const allSuggestions = [...namesToCheck, ...typesToCheck, ...categoriesToCheck];
            filteredSuggestions = allSuggestions.filter(word => word.startsWith(query));
        }
    
        // Update the suggestions state
        setSuggestions(filteredSuggestions);
    };
    
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion)
        setSuggestions([]);
    }

    
    

    return (
        <div className='searchPageWrapper'>
            <div className={"searchBar"} style={{
            borderRadius: suggestions.length > 0 ? "0.5em 0.5em 0 0" : '0.5em',
            }}>
                <div className="icon search"></div>
                <input 
                    ref={inputRef} 
                    placeholder="Search for desirable items" 
                    className="searchField" 
                    type="text" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                {suggestions.length > 0 && (
                    <div className="suggestions">
                        {suggestions.map((suggestion, index) => (
                            <div 
                            key={index} 
                            className="suggestion"
                            onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Render suggestions */}
            {filteredItems && filteredItems.length > 0 ? (
                <>
                <p className='anountOfProducts'>{filteredItems.length} items found</p>
                {filteredItems.map((product, index) => (
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
                            <Link to={`/products/${product.id}`} className="button">
                                <p>View product</p>
                                <div></div>
                            </Link>
                        </div>
                        <p className="price">{`US$${product.price.toFixed(2)}`}</p>
                    </div>
                ))}
                </>
            ) : searchQuery.length > 0 ? (
                <h2 className="nothingFound">
                    Nothing was found. Try to search with another keyword.
                </h2>
            ) : (
                <h2 className="nothingFound">
                    Try to search for desired product.
                </h2>
            )} 
        </div>
    );
    
}

export default Search;
