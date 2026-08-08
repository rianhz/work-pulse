import { Env } from './env-config';

export const corsOptions = {
  origin: Env.FRONTEND_URL, 
  credentials: true, 
  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};