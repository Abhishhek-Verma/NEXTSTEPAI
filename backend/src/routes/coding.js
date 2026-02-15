import express from 'express';
import db from '../db/index.js';
import { codingProfiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, codingProfileSchema } from '../middleware/validation.js';

const router = express.Router();

// Get coding profile for the authenticated user
router.get('/profile', requireAuth, async (req, res) => {
    try {
        let [profile] = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        // If no profile exists, return empty structure
        if (!profile) {
            profile = {
                userId: req.user.id,
                githubUsername: '',
                githubProfileUrl: '',
                githubMetrics: {},
                leetcodeUsername: '',
                leetcodeProfileUrl: '',
                leetcodeMetrics: {},
                codeforcesHandle: '',
                codeforcesProfileUrl: '',
                codeforcesMetrics: {},
                codechefHandle: '',
                codechefProfileUrl: '',
                codechefMetrics: {},
            };
        }

        // Transform to frontend format
        const response = {
            profile: {
                platforms: {
                    github: {
                        username: profile.githubUsername || '',
                        profileUrl: profile.githubProfileUrl || '',
                        metrics: profile.githubMetrics || {},
                    },
                    leetcode: {
                        username: profile.leetcodeUsername || '',
                        profileUrl: profile.leetcodeProfileUrl || '',
                        metrics: profile.leetcodeMetrics || {},
                    },
                    codeforces: {
                        handle: profile.codeforcesHandle || '',
                        profileUrl: profile.codeforcesProfileUrl || '',
                        metrics: profile.codeforcesMetrics || {},
                    },
                    codechef: {
                        handle: profile.codechefHandle || '',
                        profileUrl: profile.codechefProfileUrl || '',
                        metrics: profile.codechefMetrics || {},
                    },
                },
            },
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching coding profile:', error);
        res.status(500).json({ error: 'Failed to fetch coding profile' });
    }
});

// Save/update coding profile
router.post('/profile', requireAuth, validate(codingProfileSchema), async (req, res) => {
    try {
        const { platforms } = req.body;

        const profileData = {
            userId: req.user.id,
            githubUsername: platforms.github?.username || null,
            githubProfileUrl: platforms.github?.profileUrl || null,
            githubMetrics: platforms.github?.metrics || {},
            leetcodeUsername: platforms.leetcode?.username || null,
            leetcodeProfileUrl: platforms.leetcode?.profileUrl || null,
            leetcodeMetrics: platforms.leetcode?.metrics || {},
            codeforcesHandle: platforms.codeforces?.handle || null,
            codeforcesProfileUrl: platforms.codeforces?.profileUrl || null,
            codeforcesMetrics: platforms.codeforces?.metrics || {},
            codechefHandle: platforms.codechef?.handle || null,
            codechefProfileUrl: platforms.codechef?.profileUrl || null,
            codechefMetrics: platforms.codechef?.metrics || {},
            updatedAt: new Date(),
        };

        // Check if profile exists
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        let profile;
        if (existing) {
            // Update existing profile
            [profile] = await db
                .update(codingProfiles)
                .set(profileData)
                .where(eq(codingProfiles.userId, req.user.id))
                .returning();
        } else {
            // Insert new profile
            [profile] = await db
                .insert(codingProfiles)
                .values(profileData)
                .returning();
        }

        res.json({ message: 'Coding profile saved successfully', profile });
    } catch (error) {
        console.error('Error saving coding profile:', error);
        res.status(500).json({ error: 'Failed to save coding profile' });
    }
});

export default router;
