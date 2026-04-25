import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dateOfBirth: { type: String },
  bloodType: { type: String },
  emergencyContact: { type: String },
  emergencyPhone: { type: String },
  allergies: [String],
  conditions: [String],
  medications: [String],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return res.status(400).json({ 
        success: false, 
        error: 'MONGODB_URI not set' 
      });
    }

    // Connect
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    } as any);

    // Create test user if doesn't exist
    const existingUser = await User.findOne({ email: 'test1@gmail.com' });
    
    if (existingUser) {
      await mongoose.disconnect();
      return res.status(200).json({
        success: true,
        message: 'Test user already exists',
        user: {
          email: existingUser.email,
          name: existingUser.name,
          _id: existingUser._id
        }
      });
    }

    // Create new test user
    const newUser = new User({
      email: 'test1@gmail.com',
      password: '123456',
      name: 'Test User',
      bloodType: 'O+',
      dateOfBirth: '1990-01-01',
      emergencyContact: 'John Doe',
      emergencyPhone: '1234567890',
      allergies: [],
      conditions: [],
      medications: []
    });

    await newUser.save();
    await mongoose.disconnect();

    return res.status(200).json({
      success: true,
      message: 'Test user created successfully',
      user: {
        email: newUser.email,
        name: newUser.name,
        _id: newUser._id
      }
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      error: errorMsg
    });
  }
}
