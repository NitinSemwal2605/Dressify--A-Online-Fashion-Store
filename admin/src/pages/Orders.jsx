import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { assets } from '../assets/assets';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  const fetchAllOrders = async () => {
    if (!token) {
      console.error('Token is required to fetch orders');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/orders/list`, {}, {
        headers: { token },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []); // Ensure orders array is set correctly
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching all orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format the date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'; // Handle missing date
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto  p-6">
        <h3 className="text-2xl font-bold mb-6">Orders Page</h3>
        <div>
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-200 p-5 md:p-8 my-3 md:my-4 text-sm text-gray-700 rounded-lg shadow-sm"
            >
              <img src={assets.parcel_icon} alt="Parcel Icon" style={{ width: '50px' }} />
              <div>
                <h4 className="font-semibold">Items:</h4>
                {order.items?.map((item, idx) => (
                  <p key={item._id || idx}>
                    {item.name} x {item.quantity} <span>{item.size}{idx !== order.items.length - 1 && ','}</span>
                  </p>
                ))}
                <p>Name: {order.address?.FirstName} {order.address?.LastName}</p>
                <div>
                  <p>Address: {order.address?.Street}</p>
                  <p>
                    {order.address?.City}, {order.address?.State}, {order.address?.Country} - {order.address?.Zip}
                  </p>
                </div>
                <p>Phone: {order.address?.Phone}</p>
              </div>
              <div>
                <p>Items: {order.items?.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {formatDate(order.date)}</p>
              </div>
              <p className="font-semibold">{currency}{order.amount}</p>
              <select defaultValue="Order Placed" className="border border-gray-300 rounded-md p-1">
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrder;
