import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const diagnostics: any = {
    mongodb_uri_set: !!process.env.MONGODB_URI,
    mongoose_version: mongoose.version,
    node_env: process.env.NODE_ENV,
    connection_state: mongoose.connection.readyState,
  };

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return res.status(400).json({
        success: false,
        error: 'MONGODB_URI environment variable not set',
        diagnostics
      });
    }

    // Try to connect
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      } as any);
    }

    diagnostics.connection_state = mongoose.connection.readyState;
    diagnostics.connected = true;
    diagnostics.db_name = mongoose.connection.db?.getName();

    // Try to list collections
    const collections = await mongoose.connection.db?.listCollections().toArray();
    diagnostics.collections = collections?.map((c: any) => c.name);

    return res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      diagnostics
    });
  } catch (error) {
    diagnostics.error = error instanceof Error ? error.message : String(error);
    diagnostics.error_type = error instanceof Error ? error.constructor.name : typeof error;
    
    return res.status(500).json({
      success: false,
      diagnostics
    });
  }
}
