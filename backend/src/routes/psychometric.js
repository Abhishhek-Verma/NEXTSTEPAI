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
        const tests = await db
            .select()
            .from(psychometricTests)
            .where(eq(psychometricTests.userId, req.user.id))
            .orderBy(psychometricTests.takenAt);

        // For backward compatibility, return most recent test as 'test'
        const test = tests.length > 0 ? tests[tests.length - 1] : {
            testName: 'Career Traits Assessment',
            traits: {},
            takenAt: null,
        };

        res.json({ test, tests }); // Return both current test and history
    } catch (error) {
        console.error('Error fetching psychometric results:', error);
        res.status(500).json({ error: 'Failed to fetch psychometric results' });
    }
});

// Save/update psychometric test results
router.post('/results', requireAuth, async (req, res) => {
    try {
        const testData = {
            userId: req.user.id,
            testName: req.body.testName || 'Career Traits Assessment',
            traits: req.body.traits || {},
            takenAt: new Date(),
        };

        // Always insert new test (allow multiple test attempts)
        const [test] = await db
            .insert(psychometricTests)
            .values(testData)
            .returning();

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
