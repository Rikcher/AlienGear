import'/src/styles/css/IndividualProduct.css'
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, get, set } from 'firebase/database';
import { useParams } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom";
import { auth } from '/src/firebase-config.jsx'; 

const IndividualProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const db = getDatabase();
    const id = useParams().id // Get the product ID from the URL
    const [selectedPicture, setSelectedPicture] = useState({
        url: 'default-preview-picture-url',
        borderColor: '#6C6C6C'
    });
    const [animateImage, setAnimateImage] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [isBlue, setIsBlue] = useState(false);
    const [shake, setShake] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false);

    // Fetch product details from Firebase on component mount or when id changes
    useEffect(() => {
        window.scrollTo(0, 0); // reseting window scroll position on page load
        const fetchProduct = () => {
            const [category, itemId] = id.split('-');
            if (category === 'pads') {
                const dbRef = ref(db, `products/${category}`);
                onValue(dbRef, (snapshot) => {
                    const productData = snapshot.val();
                    const productWithId = { ...productData, itemId };
                    setProduct(productWithId);
                    setAnimateImage(true);
                });
            } else {
                const dbRef = ref(db, `products/${category}/${itemId}`);
                onValue(dbRef, (snapshot) => {
                    const productData = snapshot.val();
                    let price = productData.price;
                    if (!price.toString().includes('.')) {
                        price = parseFloat(price).toFixed(2);
                    }
                    const productWithPrice = { ...productData, price, id };
                    setProduct(productWithPrice);
                    setSelectedPicture({ url: productData.previewPicture, borderColor: '#6C6C6C' });
                });
            }
            
        };

        fetchProduct();
    }, [id]); // Depend on id to re-run effect when id changes

    //when error message trigerd this function will make sure that it popup for 5s and then disappear
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

     // Function to add product to cart     
    const addToCart = async (product) => {
        const user = auth.currentUser;
        if (user) {
            const cartRef = ref(db, `carts/${user.uid}`);
            const snapshot = await get(cartRef);
            const existingCartItems = snapshot.val() || {};      
            // Check if the product is already in the cart
            const productExists = id in existingCartItems;
        
            if (!productExists) {
                // If the product is not in the cart, add it
                await set(ref(db, `carts/${user.uid}/${id}`), {
                    id: id,
                    name: product.name,
                    description: product.description,
                    techSpecs: product.techSpecs ? product.techSpecs : {},
                    price: parseInt(product.price),
                    mainPicture: product.mainPicture || product.pictures[product.itemId],
                    quantity: 1
                });
                if(isVisible) {
                    setIsBlue(true) //set color of message to blue
                    setErrorText('Product added to cart') //set message text
                    setShake(true); //shake message if it already visable
                    setTimeout(() => { //make sure that shake effect completes
                        setShake(false);
                    }, 500);
                } else {
                    setIsBlue(true)
                    setErrorText('Product added to cart')
                }
            } else {
                if (isVisible) {
                    setIsBlue(false)
                    setErrorText('Product is already in the cart')
                    setShake(true);
                    setTimeout(() => {
                        setShake(false);
                    }, 500);
                } else {
                    setErrorText('Product is already in the cart')
                }
            }
        } else {
            if (isVisible) {
                setIsBlue(false)
                setErrorText('Please log in first')
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                }, 500);
            } else {
                setErrorText('Please log in first')
            }
        }
    };

    //if user cant see bottom if preview picture, therefore cant see tech specs, show go to tech specs button as fied and scroll it with page scroll. When user can see bottom of preview picture and start to see tech specs, mount go to tech specs button to bottom of its container
    async function toggleButtonPosition() {
        const infoContainer = document.getElementById('infoContainer');
        if (!infoContainer) {
            return;
        }
        const infoContainerBottom = infoContainer.getBoundingClientRect().bottom;
        const button = document.getElementById('goToTechSpecsButton');
    
        // Check if the bottom of the info container is within the viewport
        if (window.innerHeight - 20 >= infoContainerBottom) {
            // If yes, switch to static position
            button.style.position = 'static';

        } else {
            // If not, switch to fixed position
            button.style.position = 'sticky';
        }
    }
    toggleButtonPosition()
    window.addEventListener('scroll', toggleButtonPosition);

    //when clicking on pad redirect user to its page
    const handleImageClickPads = (pictureUrl) => {
        const pictureIndex = product?.pictures.findIndex(picture => picture === pictureUrl);
        navigate(`/products/pads-${pictureIndex}`);
    };

    //change preview picture to picture that user clicked on side bar and move indicator to that picture
    const handleImageClick = (itemId) => {
        const indicator = document.getElementById("selectedPictureIndicator");
        const translateYValue = (90 * itemId) / 16; // Convert pixels to ems
        indicator.style.transform = `translateY(${translateYValue}em)`;
    };
    
    //background effect that travels between small pictures on side bar
    const handleImageHover = (itemId) => {
        const hoverEffect = document.getElementById("backgroundHoverEffect");
        const translateYValue = (90 * itemId) / 16; // Convert pixels to ems
        hoverEffect.style.transform = `translateY(${translateYValue}em)`;
    }
    

    //scroll page to tech specs
    const handleGoToTSClick = () => {
        window.scrollTo({
            top: document.body.scrollHeight, // Scroll to the bottom of the page
            behavior: 'smooth' // Smooth scrolling
        });
    }
    
    return (
        <div className={`individualProductPageWrapper ${product?.previewPicture ? "" : "biggerScreens"}`}>
            {/* if product doesnt load yet, show placeholder */}
            {product ? (
            <>
            <div className="topPart">
                <div className="allPictures">
                    {/* if item isnt pad - set preview picture to its preview picture */}
                    {product.previewPicture ? (
                        <>
                            <img
                                className='previewPicture'
                                src={selectedPicture.url}
                                alt={product.name}
                                onLoad={() => setImageLoaded(true)}
                                style={{ 
                                    borderColor: selectedPicture.borderColor,
                                    display: imageLoaded ? 'block' : 'none'
                                }}
                            />
                            {!imageLoaded && //show loading disk while image loading
                                <div className='previewPicture placeholder'>
                                    <p className='loadingDisk'></p>
                                </div>}
                        </>
                    ) : (
                        // if items is pad - set preview picture to first picture in list of pads pictures
                        <>
                            <img
                            className={`previewPicture ${animateImage ? 'fadeIn' : ''}`} //animate first pad image on page load
                            src={product.pictures[product.itemId]}
                            alt={product.name}
                            style={{ 
                                maxWidth: "min(500px, 31.25em)",
                                zIndex: `${product.pictures.length + 1}`, //setup pads image stacking
                                display: imageLoaded ? 'block' : 'none'
                            }}
                            onLoad={() => { //animate first pad image on page load
                                setImageLoaded(true)
                                setTimeout(() => {
                                    setAnimateImage(false);
                                }, 500);
                            }}
                            />
                            {!imageLoaded && //show loading disk while image loading
                                <div className='previewPicture placeholder'>
                                    <p className='loadingDisk'></p>
                                </div>}
                        </>
                    )}
                    {/* if item isnt pad - set side bar that will contain items other pictures */}
                    {product.otherPictures ? (
                        <div className='smallPictures'>
                            <div id="backgroundHoverEffect"></div> 
                            <div id="selectedPictureIndicator"></div>
                            <img className='previewPictureSmall' src={product.previewPicture} alt=""
                            onClick={() => (setSelectedPicture({ url: product.previewPicture, borderColor: '$main-primary' }), handleImageClick(0))} // when clicking on picture in side bar - change preview picture to new picture and relocate indicator
                            onMouseEnter={() => handleImageHover(0)} //relocate picture hover effect
                            />
                            {product.otherPictures.map((picture, index) => (
                                <img
                                id= {index}
                                key={index}
                                className='pictures'
                                src={picture}
                                alt={product.name}
                                style={{ borderColor: selectedPicture.url === picture ? '#00FFA3' : '#6C6C6C' }}
                                onClick={() => (setSelectedPicture({ url: picture, borderColor: '$main-primary' }), handleImageClick(index))}
                                onMouseEnter={() => handleImageHover(index)}
                                />
                            ))}
                        </div>
                    ) : (
                        // if items is pad - stack rest of pictures is list on top of each other
                        product.pictures
                            .filter(picture => picture !== product.pictures[product.itemId])
                            .map((picture, index) => (
                                <img
                                    key={index}
                                    className='previewPicture others'
                                    src={picture}
                                    alt={product.name}
                                    style={{ 
                                        maxWidth: "min(500px, 31.25em)",
                                        left: `${2.5 + (index * 2.5)}em`, //stack pads images on top of each other and sliglty right from previous
                                        zIndex: `${product.pictures.length - index}`
                                    }}
                                    onClick={() => handleImageClickPads(picture)}
                                />
                            ))
                    )}
                </div>
                {/* item info */}
                <div className="info" id='infoContainer'>
                    <h2 className='name'>{product.name}</h2>
                    <p className='description'>{product.description}</p>
                    <ul className='stats'>
                        {product.stats.map((stat, index) => (
                            <li key={index} className='stat'>{stat}</li>
                        ))}
                    </ul>
                    <p className="price">US${product.price}</p>
                    <button onClick={() => addToCart(product)}>Add to cart</button>
                    <div style={{display: product.previewPicture ? "" : "none"}} id="goToTechSpecsButton" onClick={() => handleGoToTSClick()}>
                        <p>See tech specs</p>
                        <div></div>
                    </div>
                </div>
            </div>
            {/* tech specs if items isnt pad */}
            <div className='bottomPart'>
                <h2 className="title">TECH SPECS</h2>
                {product.techSpecs ? (
                    Object.entries(product.techSpecs).map(([key, value], index) => (
                        <div key={index} className="pair">
                            <p className="key">{key}</p>
                            <p className="value">{value}</p>
                        </div>
                    ))
                ) : (
                    // tech specs if item is pad
                    <div>
                        <div className="pair">
                            <p className="key">SIZE</p>
                            <p className="value">{product.itemId <= 5 ? "Large" : "Medium"}</p>
                        </div>
                        <div className="pair">
                            <p className="key">MATERIAL</p>
                            <p className="value">{product.itemId <= 5 ? "Premium Leather" : "Silicone"}</p>
                        </div>
                        <div className="pair">
                            <p className="key">THICKNESS</p>
                            <p className="value">{product.itemId <= 5 ? "2mm" : "1.5mm"}</p>
                        </div>
                        <div className="pair">
                            <p className="key">WEIGHT</p>
                            <p className="value">{product.itemId <= 5 ? "200g" : "150g"}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className={`errorMessage ${isBlue ? 'blue' : ''} ${isVisible ? 'show' : ''} ${shake ? 'shake' : ''}`}>{errorText}</div>
            </>
        ) : 
        // placeholder of product while its loading
        <>
            <div className="topPart placeholder">
                <div className="allPictures">
                    <p className='loadingDisk'></p>
                </div>
                <div className="info" id='infoContainer'>
                    <h2 className='name placeholder'></h2>
                    <p className='description placeholder'></p>
                    <p className='description2 placeholder'></p>
                    <ul className='stats'>
                        <li className='stat placeholder'></li>
                        <li className='stat placeholder'></li>
                        <li className='stat placeholder'></li>
                    </ul>
                    <p className="price placeholder"></p>
                    <button>Add to cart</button>
                    <div id="goToTechSpecsButton" onClick={() => handleGoToTSClick()}>
                        <p>See tech specs</p>
                        <div></div>
                    </div>
                </div>
            </div>
            <div className='bottomPart'>
                <h2 className="title">TECH SPECS</h2>
                    <div className="pair">
                        <p className="key">SIZE</p>
                        <p className="value">loading</p>
                    </div>
                    <div className="pair">
                        <p className="key">MATERIAL</p>
                        <p className="value">loading</p>
                    </div>
                    <div className="pair">
                        <p className="key">THICKNESS</p>
                        <p className="value">loading</p>
                    </div>
                    <div className="pair">
                        <p className="key">WEIGHT</p>
                        <p className="value">loading</p>
                    </div>
            </div>
        </>
        }
        </div>
    );

    
}

export default IndividualProduct;


