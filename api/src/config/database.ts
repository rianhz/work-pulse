import mongoose from 'mongoose';
import { Env } from './env-config';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = Env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('🚀 MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};