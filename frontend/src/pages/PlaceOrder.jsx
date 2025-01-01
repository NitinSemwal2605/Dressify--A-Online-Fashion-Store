import { useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../assets/frontend_assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../Components/Title';
import { ShopContext } from '../Context/ShopContext';

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { navigate } = useContext(ShopContext);

  // Form input states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate all fields and show toast if any field is empty
  const handlePlaceOrder = () => {
    const { firstName, lastName, email, street, city, state, zipcode, country, phone } = formData;
    if (!firstName || !lastName || !email || !street || !city || !state || !zipcode || !country || !phone) {
      toast.error("Dear Customer, please fill all details first.");
      return;
    }
    navigate('/orders');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      <ToastContainer />
      
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          type="number"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1="PAYMENT" text2="METHOD" />
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Payment Methods */}
            <div onClick={() => setPaymentMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className="h5 mx-4" src={assets.stripe_logo} alt="Stripe Logo" />
            </div>
            <div onClick={() => setPaymentMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className="h5 mx-4" src={assets.razorpay_logo} alt="Razorpay Logo" />
            </div>
            <div onClick={() => setPaymentMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="w-full text-end mt-8">
            <button onClick={handlePlaceOrder} className="bg-black text-white px-16 py-3 text-sm">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
