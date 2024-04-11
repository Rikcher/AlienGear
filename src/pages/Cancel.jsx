import { Link } from 'react-router-dom';
import '/src/styles/css/Cancel.css'

const Cancel = () => {
    return ( 
        <div className="cancelPageWrapper">
            <div className='cancelIcon'></div>
            <h2>Something went wrong!</h2>
            <Link to="/cart" className='button'>Go back to cart</Link>
        </div>
    );
}

export default Cancel;