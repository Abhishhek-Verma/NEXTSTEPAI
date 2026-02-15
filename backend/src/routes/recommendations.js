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
        const userRecs = await db
            .select()
            .from(recommendations)
            .where(eq(recommendations.userId, req.user.id))
            .orderBy(recommendations.score);

        // Group by type for frontend compatibility
        const grouped = {
            roles: userRecs.filter(r => r.recType === 'role').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                generatedAt: r.generatedAt,
            })),
            skills: userRecs.filter(r => r.recType === 'skill').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                generatedAt: r.generatedAt,
            })),
            companies: userRecs.filter(r => r.recType === 'company').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                generatedAt: r.generatedAt,
            })),
            savedRoles: [], // Note: savedRoles removed from schema
            generatedAt: userRecs.length > 0 ? userRecs[0].generatedAt : null,
        };

        res.json({ recommendations: grouped });
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
        
        // Delete existing recommendations for this user
        await db
            .delete(recommendations)
            .where(eq(recommendations.userId, req.user.id));

        // Insert new recommendations as individual rows
        const recsToInsert = [];
        const generatedAt = new Date();

        // Add role recommendations
        (aiRecommendations.roles || []).forEach((role, index) => {
            recsToInsert.push({
                userId: req.user.id,
                recType: 'role',
                content: JSON.stringify(role),
                score: role.score || (100 - index * 5), // Higher score for earlier items
                generatedAt,
            });
        });

        // Add skill recommendations
        (aiRecommendations.skills || []).forEach((skill, index) => {
            recsToInsert.push({
                userId: req.user.id,
                recType: 'skill',
                content: JSON.stringify(skill),
                score: skill.score || (100 - index * 5),
                generatedAt,
            });
        });

        // Add company recommendations
        (aiRecommendations.companies || []).forEach((company, index) => {
            recsToInsert.push({
                userId: req.user.id,
                recType: 'company',
                content: JSON.stringify(company),
                score: company.score || (100 - index * 5),
                generatedAt,
            });
        });

        let userRecs = [];
        if (recsToInsert.length > 0) {
            userRecs = await db
                .insert(recommendations)
                .values(recsToInsert)
                .returning();
        }

        res.json({ message: 'Recommendations generated successfully', recommendations: userRecs });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// NOTE: Save/unsave role functionality removed - savedRoles not in normalized schema
// If needed, create a separate savedRoles table with userId, recommendationId

export default router;
