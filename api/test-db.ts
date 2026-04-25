import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return res.status(400).json({ 
        success: false, 
        error: 'MONGODB_URI not set in environment variables' 
      });
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    } as any);

    // Get database
    const db = mongoose.connection.getClient().db(process.env.MONGODB_DB || 'med_link');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Try to find one user
    let userCount = 0;
    let userSample = null;
    try {
      const usersCollection = db.collection('users');
      userCount = await usersCollection.countDocuments();
      userSample = await usersCollection.findOne({});
    } catch (e) {
      // Collection might not exist
    }

    await mongoose.disconnect();

    return res.status(200).json({
      success: true,
      mongodb: {
        uri: mongoUri.split('@')[1] || 'hidden',
        database: process.env.MONGODB_DB || 'med_link',
        collections: collectionNames,
        userCount: userCount,
        userSample: userSample ? { _id: userSample._id, email: userSample.email, name: userSample.name } : null
      }
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      error: errorMsg,
      hint: 'Check: 1) MONGODB_URI in env vars 2) IP whitelist in MongoDB Atlas 3) Database exists'
    });
  }
}
