import { Router, Request, Response } from 'express';
import { User } from '../models/User.js';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('[v0] Login attempt:', { email: email?.toLowerCase(), hasPassword: !!password });
    
    const user = await User.findOne({ email: email?.toLowerCase() });
    console.log('[v0] User found:', !!user);

    if (!user) {
      console.log('[v0] User not found in database');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (user.password !== password) {
      console.log('[v0] Password mismatch');
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    console.log('[v0] Login successful for user:', user._id);
    res.json({
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
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name, dateOfBirth } = req.body;
    
    console.log('[v0] Signup request received:', { email, name, hasPassword: !!password });

    if (!email || !password || !name) {
      console.log('[v0] Missing required fields');
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (await User.findOne({ email: email.toLowerCase() })) {
      console.log('[v0] Email already exists:', email);
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

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        name: user.name,
      }
    });
  } catch (error) {
    console.error('[v0] Signup error:', error);
    res.status(500).json({ error: 'Signup failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Get user profile
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      bloodType: user.bloodType,
      dateOfBirth: user.dateOfBirth,
      emergencyContact: user.emergencyContact,
      emergencyPhone: user.emergencyPhone,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      bloodType: user.bloodType,
      dateOfBirth: user.dateOfBirth,
      emergencyContact: user.emergencyContact,
      emergencyPhone: user.emergencyPhone,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
