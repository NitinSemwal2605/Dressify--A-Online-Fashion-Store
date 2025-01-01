// src/context/shopContext.js
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { products } from "../assets/frontend_assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {  
    const currency = "₹";
    const deliveryCharge = 50;
    const [search , setSearch] = useState("");
    const [showSearch , setShowSearch] = useState(false); 
    const [cartItems, setCartItems] = useState({});
    const [orders, setOrders] = useState([]); // New state to hold orders
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
        
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
