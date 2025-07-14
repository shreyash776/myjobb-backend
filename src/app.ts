import path from "path";
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error.middleware';
import userRoutes from './routes/user.routes';
import cors from "cors";
import cookieParser from "cookie-parser";
import { getRecommendations } from "./recommend";
dotenv.config();

const app = express();
app.use(express.json());
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
app.post("/api/recommend", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Missing query" });

    const recommendations = await getRecommendations(query);
    res.json({ recommendations });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Demo route
app.get('/demo', (req, res) => {
  res.send('Welcome to MyJob Backend API');
});


app.use(errorHandler);

export default app;
