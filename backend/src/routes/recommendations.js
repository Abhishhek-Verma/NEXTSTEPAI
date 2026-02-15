import express from 'express';
import db from '../db/index.js';
import { recommendations, users, onboardingData, academicRecords, projects } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { generateRecommendations } from '../services/ai.js';

const router = express.Router();

// Get recommendations for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        let [userRecs] = await db
            .select()
            .from(recommendations)
            .where(eq(recommendations.userId, req.user.id));

        // If no recommendations exist, return empty structure
        if (!userRecs) {
            userRecs = {
                roles: [],
                skills: [],
                companies: [],
                savedRoles: [],
                generatedAt: null,
            };
        }

        res.json({ recommendations: userRecs });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

// Generate/update recommendations
router.post('/generate', requireAuth, async (req, res) => {
    try {
        // Gather user data from various sources
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.clerkId, req.user.id));

        const [userOnboarding] = await db
            .select()
            .from(onboardingData)
            .where(eq(onboardingData.userId, req.user.id));

        const [academicData] = await db
            .select()
            .from(academicRecords)
            .where(eq(academicRecords.userId, req.user.id));

        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.userId, req.user.id));

        // Prepare user data for AI
        const userData = {
            skills: userOnboarding?.skills || [],
            education: userOnboarding?.currentEducation || academicData?.degree,
            experience: userOnboarding?.experience || 'Entry level',
            interests: userOnboarding?.interests || [],
            projects: userProjects || [],
            academicData: academicData || null,
        };

        // Generate AI-powered recommendations
        const aiRecommendations = await generateRecommendations(userData);
        
        const recsData = {
            userId: req.user.id,
            roles: aiRecommendations.roles || [],
            skills: aiRecommendations.skills || [],
            companies: aiRecommendations.companies || [],
            savedRoles: [],
            generatedAt: new Date(),
            updatedAt: new Date(),
        };

        // Check if recommendations exist
        const [existing] = await db
            .select()
            .from(recommendations)
            .where(eq(recommendations.userId, req.user.id));

        let userRecs;
        if (existing) {
            // Update existing recommendations (preserve savedRoles)
            recsData.savedRoles = existing.savedRoles || [];
            [userRecs] = await db
                .update(recommendations)
                .set(recsData)
                .where(eq(recommendations.userId, req.user.id))
                .returning();
        } else {
            // Insert new recommendations
            [userRecs] = await db
                .insert(recommendations)
                .values(recsData)
                .returning();
        }

        res.json({ message: 'Recommendations generated successfully', recommendations: userRecs });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Save a role
router.post('/save-role', requireAuth, async (req, res) => {
    try {
        const { roleId } = req.body;

        const [userRecs] = await db
            .select()
            .from(recommendations)
            .where(eq(recommendations.userId, req.user.id));

        if (!userRecs) {
            return res.status(404).json({ error: 'No recommendations found' });
        }

        const savedRoles = userRecs.savedRoles || [];
        if (!savedRoles.includes(roleId)) {
            savedRoles.push(roleId);
        }

        await db
            .update(recommendations)
            .set({ savedRoles, updatedAt: new Date() })
            .where(eq(recommendations.userId, req.user.id));

        res.json({ message: 'Role saved successfully' });
    } catch (error) {
        console.error('Error saving role:', error);
        res.status(500).json({ error: 'Failed to save role' });
    }
});

// Unsave a role
router.delete('/save-role/:roleId', requireAuth, async (req, res) => {
    try {
        const { roleId } = req.params;

        const [userRecs] = await db
            .select()
            .from(recommendations)
            .where(eq(recommendations.userId, req.user.id));

        if (!userRecs) {
            return res.status(404).json({ error: 'No recommendations found' });
        }

        const savedRoles = (userRecs.savedRoles || []).filter(id => id !== roleId);

        await db
            .update(recommendations)
            .set({ savedRoles, updatedAt: new Date() })
            .where(eq(recommendations.userId, req.user.id));

        res.json({ message: 'Role unsaved successfully' });
    } catch (error) {
        console.error('Error unsaving role:', error);
        res.status(500).json({ error: 'Failed to unsave role' });
    }
});

export default router;
