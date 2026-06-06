import dotenv from 'dotenv';
dotenv.config();


export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true, 
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};