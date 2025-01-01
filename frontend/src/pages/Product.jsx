import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        console.log(item);
      }
      return null;
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-hidden justify-between sm:justify-normal sm:w-[18.7%] w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100'>
            {productData.image.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => setImage(item)}
                className='cursor-pointer w-[24%] sm:w-full sm:mb-3 flex-shrink-0 object-cover rounded-lg transition-transform duration-300 hover:scale-105'
                alt={`Product Image ${index + 1}`}
              />
            ))}
          </div>
          <div className='flex-1'>
            <img src={image} alt="Selected Product" className='w-full sm:w-[80%] rounded-lg shadow-lg' />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="Dull Star" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency} {productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5 ">
            {productData.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`w-8 h-8 border bg-gray-100 flex items-center justify-center cursor-pointer
                    ${item === size ? 'border-orange-500' : ''}
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white py-3 px-8 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          <hr className="mt-8 sm:w-4/5" />

          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>100% Original product</p>
            <p>Free delivery on order above $49</p>
            <p>Easy return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex">
          <b className="px-5 py-3 text-sm border">Description</b>
          <p className="px-5 py-3 text-sm border">Reviews (122)</p>
        </div>

        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 ">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
        
      </div>
    </div>
  ) : (
    <div className='opacity-0'>Loading...</div>
  );
};

export default Product;
