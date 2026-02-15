import express from 'express';
import db from '../db/index.js';
import { academicRecords } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, academicRecordSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all academic records for the authenticated user
router.get('/records', requireAuth, async (req, res) => {
    try {
        const records = await db
            .select()
            .from(academicRecords)
            .where(eq(academicRecords.userId, req.user.id));

        res.json({ records });
    } catch (error) {
        console.error('Error fetching academic records:', error);
        res.status(500).json({ error: 'Failed to fetch academic records' });
    }
});

// Save/update academic records
router.post('/records', requireAuth, async (req, res) => {
    try {
        const { records: newRecords } = req.body;

        // Delete existing records for this user
        await db.delete(academicRecords).where(eq(academicRecords.userId, req.user.id));

        // Insert new records
        if (newRecords && newRecords.length > 0) {
            const recordsToInsert = newRecords.map(record => ({
                userId: req.user.id,
                semester: record.semester || null,
                gpa: record.gpa ? String(record.gpa) : null,
                details: record.details || null,
            }));

            await db.insert(academicRecords).values(recordsToInsert);
        }

        // Fetch and return updated records
        const updatedRecords = await db
            .select()
            .from(academicRecords)
            .where(eq(academicRecords.userId, req.user.id));

        res.json({ message: 'Academic records saved successfully', records: updatedRecords });
    } catch (error) {
        console.error('Error saving academic records:', error);
        res.status(500).json({ error: 'Failed to save academic records' });
    }
});

// Delete a specific academic record
router.delete('/records/:id', requireAuth, async (req, res) => {
    try {
        const recordId = parseInt(req.params.id);
        
        await db
            .delete(academicRecords)
            .where(
                and(
                    eq(academicRecords.id, recordId),
                    eq(academicRecords.userId, req.user.id)
                )
            );

        res.json({ message: 'Academic record deleted successfully' });
    } catch (error) {
        console.error('Error deleting academic record:', error);
        res.status(500).json({ error: 'Failed to delete academic record' });
    }
});

export default router;
