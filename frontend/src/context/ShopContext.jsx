// src/context/shopContext.js
import axios from 'axios';
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


export const ShopContext = createContext();

// eslint-disable-next-line react/prop-types
const ShopContextProvider = ({ children }) => {  
    const currency = "₹";
    const deliveryCharge = 50;
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001"; 
    const [search , setSearch] = useState("");
    const [showSearch , setShowSearch] = useState(false); 
    const [cartItems, setCartItems] = useState({});
    const [orders, setOrders] = useState([]); // New state to hold orders
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const addOrder = () => {
      let tempOrders = structuredClone(orders);
      let newOrder = [];
  
      for (const item in cartItems) {
        for (const size in cartItems[item]) {
          if (cartItems[item][size] > 0) {
            newOrder.push({
              _id: item,
              size,
              quantity: cartItems[item][size],
            });
          }
        }
      }
      setOrders([...tempOrders, ...newOrder]);
      //setCartItems({}); // Clear cart after placing the order
    };
    // add items to cart
    const addToCart = async (itemId, size) => {
        if (!size) {
          toast.error('Please select a size');
          return;
        }
    
        let cartData = structuredClone(cartItems);
    
        if (cartData[itemId]) {
          cartData[itemId][size]
            ? (cartData[itemId][size] += 1)
            : (cartData[itemId][size] = 1);
        } else {
          cartData[itemId] = {};
          cartData[itemId][size] = 1;
        }
    
        setCartItems(cartData);
      };

      const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
          for (const size in cartItems[item]) {
            if (cartItems[item][size] > 0) {
              totalCount += cartItems[item][size];
            }
          }
        }
        return totalCount;
      };

      const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
      };

      const getCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
          const productInfo = products.find((product) => product._id === item);
          for (const size in cartItems[item]) {
            try {
              if (cartItems[item][size] > 0) {
                totalAmount += productInfo.price * cartItems[item][size];
              }
            } catch (error) {
              console.log('error', error);
            }
          }
        }
        return totalAmount;
      };

      const getProductsData = async () => {
        try {
          
          console.log(backendURL);
          const response = await axios.get(backendURL + "/api/product/list");
          console.log("Fetched Products:", response.data);
      
          if (response.data && response.data.success) {
            setProducts(response.data.products);
          } else {
            toast.error(response.data.message || 'Error in fetching products');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          toast.error('An error occurred while fetching products');
        }
      };

      useEffect(() => {
        getProductsData();
      }, []);

    const value = {
        products,
        currency,
        deliveryCharge,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        addOrder,
        orders,
        backendURL,
        token,
        setToken,
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
