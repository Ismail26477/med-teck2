import { Router, Request, Response } from 'express';
import { Medication } from '../models/Medication.js';

const router = Router();

// Get all medications for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log('[v0] Fetching medications for userId:', userId);
    const medications = await Medication.find({ userId }).sort({ createdAt: -1 });
    console.log('[v0] Found medications:', medications.length);
    res.json(medications);
  } catch (error) {
    console.error('[v0] Error fetching medications:', error);
    res.status(500).json({ error: 'Failed to fetch medications', details: String(error) });
  }
});

// Create medication
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, name, dose, frequency, prescriber, notes } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const medication = new Medication({
      userId,
      name,
      dosage: dose,
      frequency,
      reason: prescriber || '',
      startDate: new Date().toISOString().split('T')[0],
      prescribedBy: prescriber,
      notes,
    });
    
    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    console.error('[v0] Medication creation error:', error);
    res.status(500).json({ error: 'Failed to create medication' });
  }
});

// Update medication
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, dose, frequency, prescriber, notes } = req.body;
    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (dose) updateData.dosage = dose;
    if (frequency) updateData.frequency = frequency;
    if (prescriber !== undefined) {
      updateData.reason = prescriber || '';
      updateData.prescribedBy = prescriber;
    }
    if (notes !== undefined) updateData.notes = notes;
    
    const medication = await Medication.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update medication' });
  }
});

// Delete medication
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medication' });
  }
});

export default router;
