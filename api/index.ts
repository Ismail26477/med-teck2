import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from 'mongoose';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from '../server/routes/auth.js';
import medicationsRoutes from '../server/routes/medications.js';
import allergiesRoutes from '../server/routes/allergies.js';
import conditionsRoutes from '../server/routes/conditions.js';
import filesRoutes from '../server/routes/files.js';
import reportsRoutes from '../server/routes/reports.js';
import shareRoutes from '../server/routes/share.js';

const app = express();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'medisync';

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

// Connect to MongoDB
let dbConnected = false;

const connectDB = async () => {
  if (dbConnected) return;
  
  try {
    await connect(MONGODB_URI, {
      dbName: MONGODB_DB,
    });
    dbConnected = true;
    console.log('[v0] Connected to MongoDB');
  } catch (error) {
    console.error('[v0] MongoDB connection error:', error);
    throw error;
  }
};

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:8080',
];

// Add Vercel production domain if available
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/allergies', allergiesRoutes);
app.use('/api/conditions', conditionsRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/share', shareRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[v0] Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Vercel Serverless Function Handler
export default async (req: VercelRequest, res: VercelResponse) => {
  // Connect to DB on first request
  if (!dbConnected) {
    try {
      await connectDB();
    } catch (error) {
      return res.status(500).json({
        error: 'Database connection failed',
        details: (error as Error).message,
      });
    }
  }

  // Handle the request
  return new Promise((resolve) => {
    app(req as any, res as any, () => {
      resolve(undefined);
    });
  });
};
