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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();
    const User = getUser();
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (req.method === 'GET') {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        id: user._id,
        email: user.email,
        name: user.name,
        bloodType: user.bloodType,
        dateOfBirth: user.dateOfBirth,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
      });
    } else if (req.method === 'PUT') {
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        id: user._id,
        email: user.email,
        name: user.name,
        bloodType: user.bloodType,
        dateOfBirth: user.dateOfBirth,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[v0] Profile error:', error);
    return res.status(500).json({ error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
