import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl } from '../App';


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
      const response = await axios.post(`${backendUrl}/api/order/list`, {} , {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response:', response.data);
      if (response.data.success) {
        setOrders(response.data.orders); // Assuming the API returns an orders array
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold">All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="mt-6">
          {orders.map((order, index) => (
            <div key={index} className="border-b py-4">
              <h3 className="text-lg font-medium">Order #{order._id}</h3>
              <p>Status: {order.status}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Date: {formatDate(order.createdAt)}</p>

              <div className="mt-4">
                <h4 className="font-semibold">Items:</h4>
                <ul>
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center mt-2">
                      <img
                        src={item.image || 'https://via.placeholder.com/80'} // Assuming item.image is available
                        alt={item.name || 'Product Image'}
                        className="w-16 h-16 object-cover"
                      />
                      <div className="ml-4">
                        <p className="text-sm font-medium">{item.name || 'Unknown Product'}</p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                        <p className="text-sm">Price: {item.price || 'N/A'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
