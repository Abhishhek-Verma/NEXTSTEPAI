import express from 'express';
import db from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { fetchCompleteUserProfile, fetchBasicUserProfile } from '../services/userProfile.js';

const router = express.Router();

// Get user profile
router.get('/', requireAuth, async (req, res) => {
    try {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, req.user.id));

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile
router.put('/', requireAuth, async (req, res) => {
    try {
        const { firstName, lastName, imageUrl } = req.body;

        const [updatedUser] = await db
            .update(users)
            .set({
                firstName: firstName || req.user.firstName,
                lastName: lastName || req.user.lastName,
                imageUrl: imageUrl || req.user.imageUrl,
                updatedAt: new Date(),
            })
            .where(eq(users.id, req.user.id))
            .returning();

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

// Get user dashboard stats
router.get('/stats', requireAuth, async (req, res) => {
    try {
        // This endpoint could aggregate data from multiple tables
        // For now, returning basic user info
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, req.user.id));

        res.json({
            stats: {
                userId: user.id,
                onboardingCompleted: user.onboardingCompleted,
                memberSince: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

// Get complete user profile with all related data (OPTIMIZED)
router.get('/complete-profile', requireAuth, async (req, res) => {
    try {
        const completeProfile = await fetchCompleteUserProfile(req.user.id);
        res.json({ 
            success: true, 
            profile: completeProfile 
        });
    } catch (error) {
        console.error('Error fetching complete user profile:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch complete user profile' 
        });
    }
});

// Get basic user profile (lightweight)
router.get('/basic', requireAuth, async (req, res) => {
    try {
        const basicProfile = await fetchBasicUserProfile(req.user.id);
        res.json({ 
            success: true, 
            profile: basicProfile 
        });
    } catch (error) {
        console.error('Error fetching basic user profile:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch basic user profile' 
        });
    }
});

export default router;
