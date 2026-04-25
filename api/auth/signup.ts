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
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    } as any);
  } catch (err) {
    throw err;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const User = getUser();

    const { email, password, name, dateOfBirth } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      dateOfBirth: dateOfBirth || null,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error('[v0] Signup error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Signup failed'
    });
  }
}
