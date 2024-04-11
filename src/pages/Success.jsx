import { Link } from 'react-router-dom';
import '/src/styles/css/Success.css'

const Success = () => {
    return ( 
        <div className="successPageWrapper">
            <div className='successIcon'></div>
            <h2>Thank you for your purchase!</h2>
            <Link className='button' to="/products">Shop more</Link>
        </div>
    );
}

export default Success;