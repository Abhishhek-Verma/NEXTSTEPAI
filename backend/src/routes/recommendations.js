import express from 'express';
import db from '../db/index.js';
import { recommendations, users, onboardingData, academicRecords, projects, codingProfiles, psychometricTests } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { generateRecommendations } from '../services/ai.js';
import { buildUserVector, computeCosineSimilarity, computeDynamicLambda, computeConfidence } from '../services/mathEngine.js';
import { CAREER_PROFILES } from '../services/careersCatalog.js';

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
                confidence: r.confidence,
                generatedAt: r.generatedAt,
            })),
            skills: userRecs.filter(r => r.recType === 'skill').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                confidence: r.confidence,
                generatedAt: r.generatedAt,
            })),
            companies: userRecs.filter(r => r.recType === 'company').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                confidence: r.confidence,
                generatedAt: r.generatedAt,
            })),
            savedRoles: [],
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
        // Gather multi-source data across all modalities
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, req.user.id));

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

        const userCodingProfiles = await db
            .select()
            .from(codingProfiles)
            .where(eq(codingProfiles.userId, req.user.id));

        const userPsychometrics = await db
            .select()
            .from(psychometricTests)
            .where(eq(psychometricTests.userId, req.user.id));

        const latestPsych = userPsychometrics.length > 0 ? userPsychometrics[userPsychometrics.length - 1] : null;

        // Build User Vector U = [V_A, S_P, V_Psy, V_Proj] using mathEngine
        const userVectorObj = buildUserVector({
            gpa: academicData?.gpa,
            codingProfiles: userCodingProfiles,
            traits: latestPsych?.traits,
            projects: userProjects
        });

        const lambda = computeDynamicLambda(userProjects.length);
        const confidence = computeConfidence(userVectorObj.droppedCount, userVectorObj.totalDimensions);

        // Compute Content-Based Cosine Similarity & Dynamic Hybridization across Career Catalog
        const scoredCareers = CAREER_PROFILES.map(career => {
            const scoreCBF = computeCosineSimilarity(userVectorObj, career.targetVector);
            // Dynamic hybridization: Score = lambda * CBF + (1 - lambda) * CF (CF defaults to CBF baseline in cold start)
            const finalScore = Math.round((lambda * scoreCBF + (1 - lambda) * scoreCBF) * 100);

            return {
                ...career,
                score: finalScore,
                confidence: confidence
            };
        }).sort((a, b) => b.score - a.score);

        const topRankedRoles = scoredCareers.slice(0, 5);

        // Summarize coding stats for contextual prompt explanation
        const codingSummaryParts = [];
        userCodingProfiles.forEach(p => {
            if (p.platform === 'leetcode' && p.metrics) {
                codingSummaryParts.push(`LeetCode: ${p.metrics.totalSolved || 0} solved (Rating: ${p.metrics.contestRating || 'N/A'})`);
            } else if (p.platform === 'github' && p.metrics) {
                codingSummaryParts.push(`GitHub: ${p.metrics.publicRepos || 0} repos, ${p.metrics.totalStars || 0} stars`);
            } else if (p.platform === 'codeforces' && p.metrics) {
                codingSummaryParts.push(`Codeforces: Rating ${p.metrics.rating || 'N/A'}`);
            } else if (p.platform === 'codechef' && p.metrics) {
                codingSummaryParts.push(`CodeChef: Rating ${p.metrics.rating || 'N/A'}`);
            }
        });

        // Prepare grounded payload for AI explanation generation
        const userData = {
            skills: userOnboarding?.skills || [],
            education: userOnboarding?.currentEducation || academicData?.details || 'Computer Science / Engineering',
            experience: userOnboarding?.experience || 'Entry level',
            interests: userOnboarding?.interests || [],
            projects: userProjects || [],
            academicData: academicData || null,
            codingSummary: codingSummaryParts.join(', ') || 'No competitive platforms connected yet',
            computedDecision: {
                userVector: userVectorObj.raw,
                rankedRoles: topRankedRoles,
                confidence: confidence,
            }
        };

        // Generate AI-powered narrative reasoning using mathematically pre-computed scores
        const aiRecommendations = await generateRecommendations(userData);
        
        // Delete existing recommendations for this user
        await db
            .delete(recommendations)
            .where(eq(recommendations.userId, req.user.id));

        // Insert new recommendations as individual rows
        const recsToInsert = [];
        const generatedAt = new Date();

        // Add role recommendations
        (aiRecommendations.roles || []).forEach((role) => {
            recsToInsert.push({
                userId: req.user.id,
                recType: 'role',
                content: JSON.stringify(role),
                score: String(role.score),
                confidence: String(role.confidence || confidence),
                generatedAt,
            });
        });

        // Add skill recommendations
        (aiRecommendations.skills || []).forEach((skill) => {
            recsToInsert.push({
                userId: req.user.id,
                recType: 'skill',
                content: JSON.stringify(skill),
                score: String(skill.targetLevel || 85),
                confidence: String(confidence),
                generatedAt,
            });
        });

        // Add company recommendations
        (aiRecommendations.companies || []).forEach((company) => {
            recsToInsert.push({
                userId: req.user.id,
                recType: 'company',
                content: JSON.stringify(company),
                score: String(company.matchScore || 90),
                confidence: String(confidence),
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

        const grouped = {
            roles: userRecs.filter(r => r.recType === 'role').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                confidence: r.confidence,
                generatedAt: r.generatedAt,
            })),
            skills: userRecs.filter(r => r.recType === 'skill').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                confidence: r.confidence,
                generatedAt: r.generatedAt,
            })),
            companies: userRecs.filter(r => r.recType === 'company').map(r => ({
                id: r.id,
                ...JSON.parse(r.content),
                score: r.score,
                confidence: r.confidence,
                generatedAt: r.generatedAt,
            })),
            savedRoles: [],
            generatedAt: userRecs.length > 0 ? userRecs[0].generatedAt : null,
        };

        res.json({ message: 'Recommendations generated successfully', recommendations: grouped });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// NOTE: Save/unsave role functionality removed - savedRoles not in normalized schema
// If needed, create a separate savedRoles table with userId, recommendationId

export default router;
