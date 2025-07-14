import path from "path";
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import userRoutes from './routes/user.routes';
dotenv.config();



const app = express();
app.use(errorHandler);

app.use(express.json());
app.use('/api/users', userRoutes);

app.use('/images', express.static(path.join(__dirname, '../images')));
//demo route
app.get('/demo', (req, res) => {
    res.send('Welcome to MyJob Backend API');
    });

export default app;
