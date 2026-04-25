import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

// Define User model inline to avoid import issues
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

// MongoDB connection cache
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not defined in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('[v0] MongoDB connected');
  } catch (error) {
    console.error('[v0] MongoDB connection failed:', error);
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

    const { email, password } = req.body;
    console.log('[v0] Login attempt:', { email: email?.toLowerCase() });

    const user = await User.findOne({ email: email?.toLowerCase() });
    console.log('[v0] User found:', !!user);

    if (!user) {
      console.log('[v0] User not found in database');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Simple password comparison (TODO: implement bcrypt)
    const passwordMatch = user.password === password;
    
    if (!passwordMatch) {
      console.log('[v0] Password mismatch');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    console.log('[v0] Login successful for user:', user._id);
    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
        bloodType: user.bloodType,
        dateOfBirth: user.dateOfBirth,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
      }
    });
  } catch (error) {
    console.error('[v0] Login error:', error);
    return res.status(500).json({ success: false, error: 'Login failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
