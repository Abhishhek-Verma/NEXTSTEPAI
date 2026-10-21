import express from 'express';
import db from '../db/index.js';
import { recommendations, users, onboardingData, academicRecords, projects, codingProfiles, psychometricTests } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { generateRecommendations } from '../services/ai.js';
import { buildUserVector, computeCosineSimilarity, computeDynamicLambda, computeConfidence } from '../services/mathEngine.js';
import { CAREER_PROFILES } from '../services/careersCatalog.js';

const router = express.Router();

// Helper function to dynamically compute, personalize, and persist recommendations
async function computeAndSaveRecommendations(userId) {
    // Gather multi-source data across all modalities
    const [
        [user],
        [userOnboarding],
        [academicData],
        userProjects,
        userCodingProfiles,
        userPsychometrics
    ] = await Promise.all([
        db.select().from(users).where(eq(users.id, userId)),
        db.select().from(onboardingData).where(eq(onboardingData.userId, userId)),
        db.select().from(academicRecords).where(eq(academicRecords.userId, userId)),
        db.select().from(projects).where(eq(projects.userId, userId)),
        db.select().from(codingProfiles).where(eq(codingProfiles.userId, userId)),
        db.select().from(psychometricTests).where(eq(psychometricTests.userId, userId)),
    ]);

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
            codingSummaryParts.push(`LeetCode: ${p.metrics.totalSolved || p.metrics.problemsSolved || 0} solved (Rating: ${p.metrics.contestRating || 'N/A'})`);
        } else if (p.platform === 'github' && p.metrics) {
            codingSummaryParts.push(`GitHub: ${p.metrics.publicRepos || p.metrics.totalRepos || 0} repos, ${p.metrics.totalStars || 0} stars`);
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
        .where(eq(recommendations.userId, userId));

    // Insert new recommendations as individual rows
    const recsToInsert = [];
    const generatedAt = new Date();

    // Add role recommendations
    (aiRecommendations.roles || []).forEach((role) => {
        recsToInsert.push({
            userId: userId,
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
            userId: userId,
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
            userId: userId,
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

    return {
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
}

// Get recommendations for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        let userRecs = await db
            .select()
            .from(recommendations)
            .where(eq(recommendations.userId, req.user.id))
            .orderBy(recommendations.score);

        // If no recommendations exist yet, compute dynamic recommendations immediately!
        if (userRecs.length === 0) {
            const dynamicRecs = await computeAndSaveRecommendations(req.user.id);
            return res.json({ recommendations: dynamicRecs });
        }

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
        const grouped = await computeAndSaveRecommendations(req.user.id);
        res.json({ message: 'Recommendations generated successfully', recommendations: grouped });
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

export default router;
