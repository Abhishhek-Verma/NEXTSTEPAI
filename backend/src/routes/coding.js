import express from 'express';
import db from '../db/index.js';
import { codingProfiles } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { validate, codingProfileSchema } from '../middleware/validation.js';
import { fetchGitHubProfile, fetchGitHubContributions } from '../services/platforms/github.js';
import { fetchLeetCodeProfile } from '../services/platforms/leetcode.js';
import { fetchCodeforcesProfile } from '../services/platforms/codeforces.js';
import { fetchCodeChefProfile } from '../services/platforms/codechef.js';

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

// Fetch and update GitHub data
router.post('/fetch/github', requireAuth, async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'GitHub username is required' });
        }

        // Fetch data from GitHub
        const profileData = await fetchGitHubProfile(username);
        const contributionsData = await fetchGitHubContributions(username);
        
        const metrics = {
            ...profileData,
            contributions: contributionsData
        };

        // Update database
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    githubUsername: username,
                    githubProfileUrl: profileData.profileUrl,
                    githubMetrics: metrics,
                    updatedAt: new Date()
                })
                .where(eq(codingProfiles.userId, req.user.id));
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    githubUsername: username,
                    githubProfileUrl: profileData.profileUrl,
                    githubMetrics: metrics
                });
        }

        res.json({ 
            message: 'GitHub profile fetched successfully', 
            platform: 'github',
            metrics 
        });
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch GitHub profile' });
    }
});

// Fetch and update LeetCode data
router.post('/fetch/leetcode', requireAuth, async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ error: 'LeetCode username is required' });
        }

        // Fetch data from LeetCode
        const metrics = await fetchLeetCodeProfile(username);

        // Update database
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    leetcodeUsername: username,
                    leetcodeProfileUrl: metrics.profileUrl,
                    leetcodeMetrics: metrics,
                    updatedAt: new Date()
                })
                .where(eq(codingProfiles.userId, req.user.id));
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    leetcodeUsername: username,
                    leetcodeProfileUrl: metrics.profileUrl,
                    leetcodeMetrics: metrics
                });
        }

        res.json({ 
            message: 'LeetCode profile fetched successfully', 
            platform: 'leetcode',
            metrics 
        });
    } catch (error) {
        console.error('Error fetching LeetCode profile:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch LeetCode profile' });
    }
});

// Fetch and update Codeforces data
router.post('/fetch/codeforces', requireAuth, async (req, res) => {
    try {
        const { handle } = req.body;
        
        if (!handle) {
            return res.status(400).json({ error: 'Codeforces handle is required' });
        }

        // Fetch data from Codeforces
        const metrics = await fetchCodeforcesProfile(handle);

        // Update database
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    codeforcesHandle: handle,
                    codeforcesProfileUrl: metrics.profileUrl,
                    codeforcesMetrics: metrics,
                    updatedAt: new Date()
                })
                .where(eq(codingProfiles.userId, req.user.id));
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    codeforcesHandle: handle,
                    codeforcesProfileUrl: metrics.profileUrl,
                    codeforcesMetrics: metrics
                });
        }

        res.json({ 
            message: 'Codeforces profile fetched successfully', 
            platform: 'codeforces',
            metrics 
        });
    } catch (error) {
        console.error('Error fetching Codeforces profile:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch Codeforces profile' });
    }
});

// Fetch and update CodeChef data
router.post('/fetch/codechef', requireAuth, async (req, res) => {
    try {
        const { handle } = req.body;
        
        if (!handle) {
            return res.status(400).json({ error: 'CodeChef handle is required' });
        }

        // Fetch data from CodeChef
        const metrics = await fetchCodeChefProfile(handle);

        // Update database
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    codechefHandle: handle,
                    codechefProfileUrl: metrics.profileUrl,
                    codechefMetrics: metrics,
                    updatedAt: new Date()
                })
                .where(eq(codingProfiles.userId, req.user.id));
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    codechefHandle: handle,
                    codechefProfileUrl: metrics.profileUrl,
                    codechefMetrics: metrics
                });
        }

        res.json({ 
            message: 'CodeChef profile fetched successfully', 
            platform: 'codechef',
            metrics 
        });
    } catch (error) {
        console.error('Error fetching CodeChef profile:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch CodeChef profile' });
    }
});

export default router;
