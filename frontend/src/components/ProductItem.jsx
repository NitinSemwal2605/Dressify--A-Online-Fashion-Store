import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/shopContext';

const ProductItem = ({ id, image, name, price }) => {
    const { currency } = useContext(ShopContext);

    return (
        <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer'>
            <div className="overflow-hidden">
                <img 
                    src={image.length > 0 ? image[0] : 'path/to/default/image.jpg'} 
                    alt={name} 
                    className='hover:scale-110 transition ease-in-out' 
                />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    );
};

export default ProductItem;
