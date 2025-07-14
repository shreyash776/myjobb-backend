import path from "path";
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import userRoutes from './routes/user.routes';
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000", 
  "https://myjobb-frontend.vercel.app"
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/images', express.static(path.join(__dirname, '../images')));

// Demo route
app.get('/demo', (req, res) => {
  res.send('Welcome to MyJob Backend API');
});


app.use(errorHandler);

export default app;
