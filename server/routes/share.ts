import { Router, Request, Response } from 'express';
import { ShareToken } from '../models/ShareToken.js';
import { User } from '../models/User.js';
import { Allergy } from '../models/Allergy.js';
import { Medication } from '../models/Medication.js';
import { MedicalCondition } from '../models/MedicalCondition.js';

const router = Router();

// Create or update a share token for a user
router.post('/enable', async (req: Request, res: Response) => {
  try {
    const { userId, token, expiresAt } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ success: false, error: 'userId and token are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Find existing share token or create new one
    let shareToken = await ShareToken.findOne({ userId });
    if (shareToken) {
      shareToken.token = token;
      shareToken.enabled = true;
      shareToken.expiresAt = expiresAt ? new Date(expiresAt) : null;
    } else {
      shareToken = new ShareToken({
        userId,
        token,
        enabled: true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });
    }

    await shareToken.save();
    console.log('[v0] Share token enabled for user:', userId);
    
    res.json({
      success: true,
      data: {
        token: shareToken.token,
        enabled: shareToken.enabled,
        expiresAt: shareToken.expiresAt,
      }
    });
  } catch (error) {
    console.error('[v0] Share enable error:', error);
    res.status(500).json({ success: false, error: 'Failed to enable sharing' });
  }
});

// Disable sharing
router.post('/disable', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const shareToken = await ShareToken.findOne({ userId });
    if (shareToken) {
      shareToken.enabled = false;
      await shareToken.save();
      console.log('[v0] Share token disabled for user:', userId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[v0] Share disable error:', error);
    res.status(500).json({ success: false, error: 'Failed to disable sharing' });
  }
});

// Validate share token and get user data (for doctors viewing patient data)
router.get('/validate/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    console.log('[v0] Validating share token:', token);

    // Find the share token
    const shareToken = await ShareToken.findOne({ token });
    if (!shareToken) {
      console.log('[v0] Share token not found');
      return res.status(404).json({ success: false, error: 'Invalid token' });
    }

    // Check if sharing is enabled
    if (!shareToken.enabled) {
      console.log('[v0] Sharing is disabled');
      return res.status(403).json({ success: false, error: 'Sharing is disabled' });
    }

    // Check if token has expired
    if (shareToken.expiresAt && new Date() > shareToken.expiresAt) {
      console.log('[v0] Share token has expired');
      return res.status(403).json({ success: false, error: 'Token has expired' });
    }

    const userId = shareToken.userId;
    
    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Fetch all related medical data for this user
    const [allergies, medications, conditions] = await Promise.all([
      Allergy.find({ userId }),
      Medication.find({ userId }),
      MedicalCondition.find({ userId }),
    ]);

    console.log('[v0] Share token validated successfully for user:', userId);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          bloodType: user.bloodType,
          dateOfBirth: user.dateOfBirth,
          emergencyContact: user.emergencyContact,
          emergencyPhone: user.emergencyPhone,
        },
        allergies,
        medications,
        conditions,
      }
    });
  } catch (error) {
    console.error('[v0] Share token validation error:', error);
    res.status(500).json({ success: false, error: 'Failed to validate token' });
  }
});

export default router;
