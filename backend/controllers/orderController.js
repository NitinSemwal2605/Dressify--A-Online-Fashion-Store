import orderModel from '../models/orderModel.js';
import UserModel from '../models/userModel.js';

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        
        const orderData = {
          userId,
          items,
          address,
          amount,
          paymentMethod: "COD",
          payment: false, 
          date: Date.now(),
        };

        // Save the new order
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        console.log('New Order Placed:', JSON.stringify(newOrder, null, 2));

        // Clear the user's cart after placing the order
        await UserModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.json({ success: false, message: error.message });
    }
};


// Placing orders using Stripe Payment Gateway
const placeOrderStripe = async (req, res) => {
  // Stripe payment logic goes here
}

// Placing orders using Razorpay Payment Gateway
const placeOrderRazor = async (req, res) => {
  // Razorpay payment logic goes here
}

// All Orders data for Admin panel
const allOrders = async (req, res) => {
  // Admin panel logic to fetch all orders goes here
}

// User Orders data for Frontend
const userOrders = async (req, res) => {
  // Logic to fetch user orders for the frontend goes here
}

// Update Order Status for Admin panel
const updateStatus = async (req, res) => {
  // Admin panel logic to update order status goes here
}

export { allOrders, placeOrder, placeOrderRazor, placeOrderStripe, updateStatus, userOrders };
