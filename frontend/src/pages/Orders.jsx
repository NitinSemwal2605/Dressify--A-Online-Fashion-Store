import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";

const Orders = () => {
  // Get token and userId from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user')); 
  const userId = user ? user._id : null;

  console.log('Token:', token);
  console.log('UserId:', userId);
  
  const { products = [], currency = "USD", backendURL } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      // Check if token or userId is missing from localStorage
      if (!token || !userId) {
        console.error("Missing token or userId:", { token, userId });
        return;
      }

      console.log("Fetching orders with:", {
        backendURL,
        userId,
        token: `Bearer ${token.substring(0, 10)}...`, // Hide full token for security
      });

      const response = await axios.post(
        `${backendURL}/api/orders/userOrders`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("API Response:", response.data); // Debug API response

      if (response.data.success && response.data.orders.length > 0) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.createdAt,
            });
          });
        });

        console.log("Processed Orders:", allOrdersItem);
        setOrders(allOrdersItem.reverse());
      } else {
        console.warn("No orders found for user.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  useEffect(() => {
    loadOrderData();
  }, [token, backendURL]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="pt-16 border-t">
      <div className="mb-3 text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">You have no orders.</p>
      ) : (
        <div>
          {orders.map((order, index) => {
            const productData = products?.find((product) => product._id === order?.productId) || {};

            console.log("Product Data:", productData); // Log product data to verify

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={order.images && order.images[0] ? order.images[0] : "https://via.placeholder.com/80"}
                    alt={order.name || "Product Image"}
                    className="w-16 sm:w-20"
                  />
                  <div>
                    <p className="sm:text-base font-medium">{order.name || "Unknown Product"}</p>
                    <div className="flex items-center gap-5 mt-2 text-base text-gray-700">
                      <p>
                        {currency}
                        {order.price || "N/A"}
                      </p>
                      <p>Quantity: {order.quantity}</p>
                      <p>Size: {order.size}</p>
                    </div>
                    <p className="mt-2">
                      Date: <span className="text-gray-400">{formatDate(order.date)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-between md:w-1/2">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2 h-2 rounded-full bg-green-400"></p>
                    <p className="text-sm md:text-base">Ready to ship</p>
                  </div>
                  <button className="border px-4 py-2 text-sm font-medium rounded-sm text-gray-700">
                    Track Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
