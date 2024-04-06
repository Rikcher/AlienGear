import'/src/styles/css/IndividualProduct.css'
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom'; // Import useParams
import { useNavigate} from "react-router-dom";

const IndividualProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const db = getDatabase();
    const id = useParams().id
    const [selectedPicture, setSelectedPicture] = useState({
        url: 'default-preview-picture-url',
        borderColor: '#6C6C6C' // Default border color
    });

    useEffect(() => {
        const fetchProduct = () => {
            const [category, itemId] = id.split('-');
            if (category === 'pads') {
                const dbRef = ref(db, `products/${category}`);
                onValue(dbRef, (snapshot) => {
                    const productData = snapshot.val();
                    const productWithId = { ...productData, itemId };
                    setProduct(productWithId);
                });
            } else {
                const dbRef = ref(db, `products/${category}/${itemId}`);
                onValue(dbRef, (snapshot) => {
                    const productData = snapshot.val();
                    let price = productData.price;
                    if (!price.toString().includes('.')) {
                        price = parseFloat(price).toFixed(2);
                    }
                    const productWithPrice = { ...productData, price };
                    setProduct(productWithPrice);
                    setSelectedPicture({ url: productData.previewPicture, borderColor: '#6C6C6C' });
                });
            }
        };

        fetchProduct();
    }, [id]); // Depend on id to re-run effect when id changes

    const handleImageClick = (pictureUrl) => {
        const pictureIndex = product?.pictures.findIndex(picture => picture === pictureUrl);
        navigate(`/products/pads-${pictureIndex}`);
    };

    if (!product) {
        return <div style={{color: "white"}}>Loading...</div>;
    }
    
    return (
        <div className='individualProductPageWrapper'>
            <div className="topPart">
                <div className="allPictures">
                    {product.previewPicture ? (
                        <img
                        className='previewPicture'
                        src={selectedPicture.url}
                        alt={product.name}
                        style={{ borderColor: selectedPicture.borderColor }}
                        />
                    ) : (
                        <img
                        className='previewPicture'
                        src={product.pictures[product.itemId]}
                        alt={product.name}
                        style={{ 
                            width: "auto",
                            zIndex: `${product.pictures.length + 1}`
                    }}
                        />
                    )}
                    {product.otherPictures ? (
                    <div className='smallPictures'>
                        <img className='previewPictureSmall' src={product.previewPicture} alt=""
                        style={{ borderColor: selectedPicture.url === product.previewPicture ? '#00FFA3' : '#6C6C6C' }}
                        onClick={() => setSelectedPicture({ url: product.previewPicture, borderColor: '$main-primary' })}
                        />
                        {product.otherPictures.map((picture, index) => (
                            <img
                            key={index}
                            className='pictures'
                            src={picture}
                            alt={product.name}
                            style={{ borderColor: selectedPicture.url === picture ? '#00FFA3' : '#6C6C6C' }}
                            onClick={() => setSelectedPicture({ url: picture, borderColor: '$main-primary' })}
                            />
                        ))}
                    </div>
                    ) : (
                        product.pictures
                            .filter(picture => picture !== product.pictures[product.itemId]) // Filter out the picture that is already used
                            .map((picture, index) => (
                                <img
                                    key={index}
                                    className='previewPicture others'
                                    src={picture}
                                    alt={product.name}
                                    style={{ 
                                        width: "auto",
                                        left: `${40 + (index * 40)}px`,
                                        zIndex: `${product.pictures.length - index}` // Start with 10px and increase by 10px for each subsequent picture
                                    }}
                                    onClick={() => handleImageClick(picture)}
                                />
                            ))
                    )}
                </div>
                <div className="info">
                    <h2 className='name'>{product.name}</h2>
                    <p className='description'>{product.description}</p>
                    <ul className='stats'>
                        {product.stats.map((stat, index) => (
                            <li key={index} className='stat'>{stat}</li>
                        ))}
                    </ul>
                    <p className="price">US${product.price}</p>
                    <button>Add to cart</button>
                </div>
            </div>
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
        </div>
    );

    
}

export default IndividualProduct;


