import express from 'express';
import db from '../db/index.js';
import { codingProfiles } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
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
        // Fetch all platform profiles for this user
        const profiles = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        // Transform to frontend format grouped by platform
        const platformsData = {
            github: null,
            leetcode: null,
            codeforces: null,
            codechef: null,
        };

        profiles.forEach(profile => {
            if (profile.platform && platformsData.hasOwnProperty(profile.platform)) {
                platformsData[profile.platform] = {
                    username: profile.metrics?.username || '',
                    profileUrl: profile.profileUrl || '',
                    metrics: profile.metrics || {},
                };
            }
        });

        const response = {
            profile: {
                platforms: platformsData,
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

        // Process each platform
        for (const [platformName, platformData] of Object.entries(platforms)) {
            if (!platformData || !platformData.profileUrl) continue;

            // Check if profile exists for this platform
            const [existing] = await db
                .select()
                .from(codingProfiles)
                .where(
                    and(
                        eq(codingProfiles.userId, req.user.id),
                        eq(codingProfiles.platform, platformName)
                    )
                );

            const profileData = {
                userId: req.user.id,
                platform: platformName,
                profileUrl: platformData.profileUrl || null,
                metrics: platformData.metrics || {},
                updatedAt: new Date(),
            };

            if (existing) {
                // Update existing profile
                await db
                    .update(codingProfiles)
                    .set(profileData)
                    .where(
                        and(
                            eq(codingProfiles.userId, req.user.id),
                            eq(codingProfiles.platform, platformName)
                        )
                    );
            } else {
                // Insert new profile
                await db.insert(codingProfiles).values(profileData);
            }
        }

        // Fetch updated profiles
        const updatedProfiles = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        res.json({ message: 'Coding profile saved successfully', profiles: updatedProfiles });
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

        // Update database - normalized structure
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(
                and(
                    eq(codingProfiles.userId, req.user.id),
                    eq(codingProfiles.platform, 'github')
                )
            );

        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    profileUrl: profileData.profileUrl,
                    metrics: metrics,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(codingProfiles.userId, req.user.id),
                        eq(codingProfiles.platform, 'github')
                    )
                );
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    platform: 'github',
                    profileUrl: profileData.profileUrl,
                    metrics: metrics
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

        // Update database - normalized structure
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(
                and(
                    eq(codingProfiles.userId, req.user.id),
                    eq(codingProfiles.platform, 'leetcode')
                )
            );

        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    profileUrl: metrics.profileUrl,
                    metrics: metrics,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(codingProfiles.userId, req.user.id),
                        eq(codingProfiles.platform, 'leetcode')
                    )
                );
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    platform: 'leetcode',
                    profileUrl: metrics.profileUrl,
                    metrics: metrics
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

        // Database caching: Check for recent data (5 minutes TTL)
        const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(
                and(
                    eq(codingProfiles.userId, req.user.id),
                    eq(codingProfiles.platform, 'codeforces')
                )
            );

        // If we have cached data that's fresh enough, return it
        if (existing && existing.metrics) {
            const cacheAge = Date.now() - new Date(existing.updatedAt).getTime();
            if (cacheAge < CACHE_TTL) {
                console.log(`Using cached Codeforces data for user ${req.user.id} (${Math.round(cacheAge/1000)}s old)`);
                return res.json({ 
                    message: 'Codeforces profile retrieved from cache', 
                    platform: 'codeforces',
                    metrics: existing.metrics,
                    cached: true,
                    cacheAge: Math.round(cacheAge / 1000) // seconds
                });
            }
        }

        // Fetch fresh data from Codeforces API
        console.log(`Fetching fresh Codeforces data for handle: ${handle}`);
        const metrics = await fetchCodeforcesProfile(handle);

        // Update database with fresh data
        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    profileUrl: metrics.profileUrl,
                    metrics: metrics,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(codingProfiles.userId, req.user.id),
                        eq(codingProfiles.platform, 'codeforces')
                    )
                );
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    platform: 'codeforces',
                    profileUrl: metrics.profileUrl,
                    metrics: metrics
                });
        }

        res.json({ 
            message: 'Codeforces profile fetched successfully', 
            platform: 'codeforces',
            metrics,
            cached: false
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

        // Database caching: Check for recent data (3 hours TTL for scraping)
        // Longer cache than Codeforces to avoid IP blocking from frequent scraping
        const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
        const [existing] = await db
            .select()
            .from(codingProfiles)
            .where(
                and(
                    eq(codingProfiles.userId, req.user.id),
                    eq(codingProfiles.platform, 'codechef')
                )
            );

        // If we have cached data that's fresh enough, return it
        if (existing && existing.metrics && existing.metrics.rating !== undefined) {
            const cacheAge = Date.now() - new Date(existing.updatedAt).getTime();
            if (cacheAge < CACHE_TTL) {
                console.log(`Using cached CodeChef data for user ${req.user.id} (${Math.round(cacheAge/1000/60)} minutes old)`);
                return res.json({ 
                    message: 'CodeChef profile retrieved from cache', 
                    platform: 'codechef',
                    metrics: existing.metrics,
                    cached: true,
                    cacheAge: Math.round(cacheAge / 60000) // minutes
                });
            }
        }

        // Fetch fresh data from CodeChef (scraping)
        console.log(`Fetching fresh CodeChef data via scraping for handle: ${handle}`);
        const metrics = await fetchCodeChefProfile(handle);

        // Update database with fresh data
        if (existing) {
            await db
                .update(codingProfiles)
                .set({
                    profileUrl: metrics.profileUrl,
                    metrics: metrics,
                    updatedAt: new Date()
                })
                .where(
                    and(
                        eq(codingProfiles.userId, req.user.id),
                        eq(codingProfiles.platform, 'codechef')
                    )
                );
        } else {
            await db
                .insert(codingProfiles)
                .values({
                    userId: req.user.id,
                    platform: 'codechef',
                    profileUrl: metrics.profileUrl,
                    metrics: metrics
                });
        }

        res.json({ 
            message: 'CodeChef profile fetched successfully', 
            platform: 'codechef',
            metrics,
            cached: false
        });
    } catch (error) {
        console.error('Error fetching CodeChef profile:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch CodeChef profile' });
    }
});

export default router;
