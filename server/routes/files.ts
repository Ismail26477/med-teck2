import { Router, Request, Response } from 'express';
import { MedicalFile } from '../models/MedicalFile.js';

const router = Router();

// Get all files for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const files = await MedicalFile.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Create file record
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('[v0] Creating file record');
    
    // Don't store the full data URL in database, extract needed info
    const { dataUrl, ...fileData } = req.body;
    
    // Validate required fields
    if (!fileData.userId || !fileData.category || !fileData.title) {
      return res.status(400).json({ error: 'Missing required fields: userId, category, title' });
    }

    const file = new MedicalFile({
      userId: fileData.userId,
      category: fileData.category,
      title: fileData.title,
      date: fileData.date,
      notes: fileData.notes,
      mimeType: fileData.mimeType,
    });
    
    await file.save();
    console.log('[v0] File saved successfully:', file._id);
    res.status(201).json(file);
  } catch (error) {
    console.error('[v0] Error creating file:', error);
    res.status(500).json({ error: 'Failed to create file record', details: (error as Error).message });
  }
});

// Update file record
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const file = await MedicalFile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update file' });
  }
});

// Delete file record
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const file = await MedicalFile.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
