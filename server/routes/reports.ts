import { Router, Request, Response } from 'express';
import { Report } from '../models/Report.js';

const router = Router();

// Get all reports for user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const reports = await Report.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get single report by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Create report
router.post('/', async (req: Request, res: Response) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error('[v0] Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Update report
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// Delete report
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

export default router;
