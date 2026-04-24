import { Router, Request, Response } from 'express';
import { Allergy } from '../models/Allergy.js';

const router = Router();

// Get all allergies for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('[v0] Fetching allergies for userId:', userId);
    const allergies = await Allergy.find({ userId }).sort({ createdAt: -1 });
    console.log('[v0] Found allergies:', allergies.length);
    res.json(allergies);
  } catch (error) {
    console.error('[v0] Error fetching allergies:', error);
    res.status(500).json({ error: 'Failed to fetch allergies', details: String(error) });
  }
});

// Create allergy
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, name, severity, notes } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const allergy = new Allergy({
      userId,
      allergen: name,
      severity,
      reaction: notes || '',
      dateDiscovered: new Date().toISOString().split('T')[0],
      notes,
    });
    await allergy.save();
    res.status(201).json(allergy);
  } catch (error) {
    console.error('[v0] Allergy creation error:', error);
    res.status(500).json({ error: 'Failed to create allergy' });
  }
});

// Update allergy
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, severity, notes } = req.body;
    const updateData: any = {};
    
    if (name) updateData.allergen = name;
    if (severity) updateData.severity = severity;
    if (notes !== undefined) {
      updateData.reaction = notes || '';
      updateData.notes = notes;
    }
    
    const allergy = await Allergy.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!allergy) {
      return res.status(404).json({ error: 'Allergy not found' });
    }
    res.json(allergy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update allergy' });
  }
});

// Delete allergy
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const allergy = await Allergy.findByIdAndDelete(req.params.id);
    if (!allergy) {
      return res.status(404).json({ error: 'Allergy not found' });
    }
    res.json({ message: 'Allergy deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete allergy' });
  }
});

export default router;
