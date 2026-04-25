import { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  dose: { type: String, required: true },
  frequency: { type: String, required: true },
  prescriber: { type: String },
  notes: { type: String },
}, { timestamps: true });

const Medication = mongoose.models.Medication || mongoose.model<any>('Medication', medicationSchema);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not set');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    if (req.method === 'POST') {
      const { userId, name, dose, frequency, prescriber, notes } = req.body;
      const medication = new Medication({ userId, name, dose, frequency, prescriber, notes });
      await medication.save();
      return res.status(201).json({ success: true, data: medication });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[v0] Medication error:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
