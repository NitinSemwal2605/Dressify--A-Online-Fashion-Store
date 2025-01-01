import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connect } from 'mongoose';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js'; 

// App Config
const app = express();
const port = process.env.PORT || 8001;
 
connectDB();
connectCloudinary();


// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/users', userRouter);
app.use('/api/product', productRouter);

app.get('/', (req, res) => res.status(200).send('API WORKING'));

app.listen(port, () => console.log(`Listening on localhost:${port}`));






