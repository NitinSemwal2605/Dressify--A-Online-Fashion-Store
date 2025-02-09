import axios from 'axios';
import { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { navigate, cartItems, products, deliveryCharge, getCartAmount, setCartItems, token, backendURL } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Street: '',
    City: '',
    State: '',
    Zipcode: '',
    Country: '',
    Phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in formData) {
      if (!formData[key].trim()) {
        toast.error(`Please enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
  
      // Collect items from cart
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
  
      if (!orderItems.length) {
        toast.error("Your cart is empty!");
        return;
      }
  
      // Ensure userId is available
      const user = JSON.parse(localStorage.getItem('user')); // Fetch user object from localStorage
      const userId = user ? user._id : null; // Extract the _id from the user object
  
      if (!userId) {
        toast.error("User is not authenticated!");
        return;
      }
  
      // Prepare order data
      let orderData = {
        userId, // Now sending the correct userId
        items: orderItems,
        amount: getCartAmount() + deliveryCharge,
        address: formData,
      };
  
      switch (paymentMethod) {
        case 'cod':
          try {
            const response = await axios.post(
              `${backendURL}/api/orders/place`,
              orderData,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
  
            console.log('Order Response:', response.data);
  
            if (response.data.success) {
              setCartItems({});
              navigate('/orders');
            } else {
              toast.error('Error placing order. Please try again.');
            }
          } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Error placing order. Please try again.');
          }
          break;
  
        default:
          toast.error("Please select a valid payment method.");
          break;
      }
    } catch (error) {
      console.error('Error creating order data:', error);
      toast.error('Error creating order data. Please try again.');
    }
  };
  

  return (
    <form className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <ToastContainer />

      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            required
            type={key === 'Email' ? 'Email' : key === 'phone' ? 'number' : 'text'}
            name={key}
            placeholder={key.replace(/([A-Z])/g, ' $1')}
            value={formData[key]}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        ))}
      </div>

      <div className="mt-8">
        <CartTotal />
        <Title text1="PAYMENT" text2="METHOD" />
        <div className="flex flex-col lg:flex-row gap-4">
          {['stripe', 'razorpay', 'cod'].map((method) => (
            <div key={method} onClick={() => setPaymentMethod(method)} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === method ? 'bg-green-400' : ''}`}></p>
              {method !== 'cod' ? (
                <img className="h5 mx-4" src={assets[`${method}_logo`]} alt={`${method} Logo`} />
              ) : (
                <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
              )}
            </div>
          ))}
        </div>
        <div className="w-full text-end mt-8">
          <button type="button" onClick={handlePlaceOrder} className="bg-black text-white px-16 py-3 text-sm">
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
