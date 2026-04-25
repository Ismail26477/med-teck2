import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const mongodbUri = process.env.MONGODB_URI ? 'Set' : 'Not set';
    const nodeEnv = process.env.NODE_ENV || 'not set';
    
    let mongoStatus = 'Disconnected';
    let mongoError = null;

    // Try to connect to MongoDB
    if (process.env.MONGODB_URI) {
      try {
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000,
          });
        }
        mongoStatus = 'Connected';
      } catch (error) {
        mongoStatus = 'Connection Failed';
        mongoError = error instanceof Error ? error.message : String(error);
      }
    }

    return res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: nodeEnv,
        MONGODB_URI: mongodbUri,
      },
      database: {
        status: mongoStatus,
        error: mongoError,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
