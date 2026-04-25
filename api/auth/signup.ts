import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

// Define User model inline
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

const User = mongoose.models.User || mongoose.model<any>('User', userSchema);

async function connectDB() {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('[v0] MongoDB already connected');
    return;
  }

  if (!process.env.MONGODB_URI) {
    const error = new Error('MONGODB_URI environment variable not set. Please add it in Vercel Settings > Environment Variables');
    console.error('[v0] Database config error:', error.message);
    throw error;
  }

  try {
    console.log('[v0] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('[v0] MongoDB connected successfully');
  } catch (error) {
    console.error('[v0] MongoDB connection failed:', error instanceof Error ? error.message : error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

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
    console.log('[v0] User created successfully:', user._id);

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
    return res.status(500).json({ error: 'Signup failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
