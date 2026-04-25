import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dateOfBirth: String,
  bloodType: String,
  emergencyContact: String,
  emergencyPhone: String,
  allergies: [String],
  conditions: [String],
  medications: [String],
}, { timestamps: true });

let User: any;

function getUser() {
  if (!User) {
    User = mongoose.models.User || mongoose.model('User', userSchema);
  }
  return User;
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not set');
  }

  await mongoose.connect(mongoUri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 10000,
  } as any);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
    const User = getUser();

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@gmail.com' });
    
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: 'Test user already exists',
        user: {
          email: existingUser.email,
          name: existingUser.name,
        }
      });
    }

    // Create test user
    const testUser = new User({
      email: 'test@gmail.com',
      password: '123456',
      name: 'Test User',
      dateOfBirth: '1990-01-01',
      bloodType: 'O+',
      emergencyContact: 'John Doe',
      emergencyPhone: '9876543210',
    });

    await testUser.save();

    return res.status(201).json({
      success: true,
      message: 'Test user created successfully',
      user: {
        email: testUser.email,
        name: testUser.name,
        password: '123456'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    });
  }
}
