import { Router, Request, Response } from 'express';
import { MedicalCondition } from '../models/MedicalCondition.js';

const router = Router();

// Get all conditions for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('[v0] Fetching conditions for userId:', userId);
    const conditions = await MedicalCondition.find({ userId }).sort({ createdAt: -1 });
    console.log('[v0] Found conditions:', conditions.length);
    res.json(conditions);
  } catch (error) {
    console.error('[v0] Error fetching conditions:', error);
    res.status(500).json({ error: 'Failed to fetch conditions', details: String(error) });
  }
});

// Create condition
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, name, notes } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const condition = new MedicalCondition({
      userId,
      name,
      status: 'active',
      diagnosedDate: new Date().toISOString().split('T')[0],
      notes,
    });
    await condition.save();
    res.status(201).json(condition);
  } catch (error) {
    console.error('[v0] Condition creation error:', error);
    res.status(500).json({ error: 'Failed to create condition' });
  }
});

// Update condition
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, notes, status } = req.body;
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;
    
    const condition = await MedicalCondition.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!condition) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    res.json(condition);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update condition' });
  }
});

// Delete condition
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const condition = await MedicalCondition.findByIdAndDelete(req.params.id);
    if (!condition) {
      return res.status(404).json({ error: 'Condition not found' });
    }
    res.json({ message: 'Condition deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete condition' });
  }
});

export default router;
