import express from 'express';
import { allOrders, placeOrder, placeOrderRazor, placeOrderStripe, updateStatus, userOrders } from '../controllers/orderController.js';
import adminAuth from '../middlewares/adminAuth.js';
import authUser from '../middlewares/auth.js';

const orderRouter = express.Router();

orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

orderRouter.post('/place' ,authUser, placeOrder);
orderRouter.post('/stripe' , authUser, placeOrderStripe);
orderRouter.post('/razorpay' , authUser, placeOrderRazor);

orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;