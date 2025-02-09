import orderModel from '../models/orderModel.js';
import UserModel from '../models/userModel.js';

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Validate userId
        const userExists = await UserModel.findById(userId);
        if (!userExists) {
            return res.status(400).json({ success: false, message: "Invalid userId. User not found." });
        }

        // Check if cart is empty
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Order cannot be placed with an empty cart." });
        }

        const orderData = {
          userId,
          items,
          address,
          amount,
          paymentMethod: "COD",
          payment: false, 
        };

        // Save the new order
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        console.log('New Order Placed:', JSON.stringify(newOrder, null, 2));

        // Clear the user's cart after placing the order
        await UserModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: "Something went wrong while placing the order." });
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
  try{
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, orders });
  }
  catch(error){
    console.error('Error fetching all orders:', error);
    res.status(500).json({ success: false, message: "Something went wrong while fetching all orders." });
  }
}

// User Orders data for Frontend 
const userOrders = async (req, res) => {
  try{
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  }
  catch(error){
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: "Something went wrong while fetching user orders." });
  }
  // Logic to fetch user orders for the frontend goes here
}

// Update Order Status for Admin panel
const updateStatus = async (req, res) => {
  // Admin panel logic to update order status goes here
}

export { allOrders, placeOrder, placeOrderRazor, placeOrderStripe, updateStatus, userOrders };
