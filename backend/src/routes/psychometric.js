import express from 'express';
import db from '../db/index.js';
import { psychometricTests } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, psychometricSchema } from '../middleware/validation.js';

const router = express.Router();

// Get psychometric test results for the authenticated user
router.get('/results', requireAuth, async (req, res) => {
    try {
        let [test] = await db
            .select()
            .from(psychometricTests)
            .where(eq(psychometricTests.userId, req.user.id));

        // If no test exists, return empty structure
        if (!test) {
            test = {
                testName: 'Career Traits Assessment',
                traits: {},
                score: 0,
                progress: 0,
                responses: {},
                takenAt: null,
            };
        }

        res.json({ test });
    } catch (error) {
        console.error('Error fetching psychometric results:', error);
        res.status(500).json({ error: 'Failed to fetch psychometric results' });
    }
});

// Save/update psychometric test results
router.post('/results', requireAuth, validate(psychometricSchema), async (req, res) => {
    try {
        const testData = {
            userId: req.user.id,
            testName: req.body.testName || 'Career Traits Assessment',
            traits: req.body.traits || {},
            score: req.body.score || 0,
            progress: req.body.progress || 0,
            responses: req.body.responses || {},
            takenAt: req.body.progress === 100 ? new Date() : null,
            updatedAt: new Date(),
        };

        // Check if test exists
        const [existing] = await db
            .select()
            .from(psychometricTests)
            .where(eq(psychometricTests.userId, req.user.id));

        let test;
        if (existing) {
            // Update existing test
            [test] = await db
                .update(psychometricTests)
                .set(testData)
                .where(eq(psychometricTests.userId, req.user.id))
                .returning();
        } else {
            // Insert new test
            [test] = await db
                .insert(psychometricTests)
                .values(testData)
                .returning();
        }

        res.json({ message: 'Psychometric results saved successfully', test });
    } catch (error) {
        console.error('Error saving psychometric results:', error);
        res.status(500).json({ error: 'Failed to save psychometric results' });
    }
});

// Delete psychometric test results
router.delete('/results', requireAuth, async (req, res) => {
    try {
        await db
            .delete(psychometricTests)
            .where(eq(psychometricTests.userId, req.user.id));

        res.json({ message: 'Psychometric results deleted successfully' });
    } catch (error) {
        console.error('Error deleting psychometric results:', error);
        res.status(500).json({ error: 'Failed to delete psychometric results' });
    }
});

export default router;
