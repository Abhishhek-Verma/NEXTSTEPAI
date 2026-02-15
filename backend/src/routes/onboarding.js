import express from 'express';
import db from '../db/index.js';
import { onboardingData, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, onboardingSchema } from '../middleware/validation.js';

const router = express.Router();

// Get onboarding data for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        let [data] = await db
            .select()
            .from(onboardingData)
            .where(eq(onboardingData.userId, req.user.id));

        // If no onboarding data exists, return empty structure
        if (!data) {
            data = {
                currentEducation: '',
                graduationYear: null,
                careerGoals: [],
                interests: [],
                skills: [],
                experience: '',
                completedAt: null,
            };
        }

        res.json({ onboarding: data });
    } catch (error) {
        console.error('Error fetching onboarding data:', error);
        res.status(500).json({ error: 'Failed to fetch onboarding data' });
    }
});

// Complete onboarding
router.post('/complete', requireAuth, validate(onboardingSchema), async (req, res) => {
    try {
        const onboardingInfo = {
            userId: req.user.id,
            currentEducation: req.body.currentEducation || '',
            graduationYear: req.body.graduationYear || null,
            careerGoals: req.body.careerGoals || [],
            interests: req.body.interests || [],
            skills: req.body.skills || [],
            experience: req.body.experience || '',
            completedAt: new Date(),
            updatedAt: new Date(),
        };

        // Check if onboarding data exists
        const [existing] = await db
            .select()
            .from(onboardingData)
            .where(eq(onboardingData.userId, req.user.id));

        let data;
        if (existing) {
            // Update existing onboarding data
            [data] = await db
                .update(onboardingData)
                .set(onboardingInfo)
                .where(eq(onboardingData.userId, req.user.id))
                .returning();
        } else {
            // Insert new onboarding data
            [data] = await db
                .insert(onboardingData)
                .values(onboardingInfo)
                .returning();
        }

        // Mark user as onboarded
        await db
            .update(users)
            .set({ onboardingCompleted: true, updatedAt: new Date() })
            .where(eq(users.id, req.user.id));

        res.json({ message: 'Onboarding completed successfully', onboarding: data });
    } catch (error) {
        console.error('Error completing onboarding:', error);
        res.status(500).json({ error: 'Failed to complete onboarding' });
    }
});

export default router;
