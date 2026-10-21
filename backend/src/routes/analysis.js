import express from 'express';
import db from '../db/index.js';
import { users, academicRecords, projects, codingProfiles, psychometricTests } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { requireAuth } from '../middleware/auth.js';
import { buildUserVector, classifyCareerInclination, computeConfidence } from '../services/mathEngine.js';

const router = express.Router();

/**
 * Get live AI career analysis & inclination classification for the authenticated user
 * Implements the Inclination Classifier from Figure 1 of NextStepAI Research Paper
 */
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const [
            [academicData],
            userProjects,
            userCodingProfiles,
            userPsychometrics
        ] = await Promise.all([
            db.select().from(academicRecords).where(eq(academicRecords.userId, req.user.id)),
            db.select().from(projects).where(eq(projects.userId, req.user.id)),
            db.select().from(codingProfiles).where(eq(codingProfiles.userId, req.user.id)),
            db.select().from(psychometricTests).where(eq(psychometricTests.userId, req.user.id)),
        ]);

        const latestPsych = userPsychometrics.length > 0 ? userPsychometrics[userPsychometrics.length - 1] : null;

        // Build 4D multi-modal user vector
        const userVectorObj = buildUserVector({
            gpa: academicData?.gpa,
            codingProfiles: userCodingProfiles,
            traits: latestPsych?.traits,
            projects: userProjects
        });

        const confidence = computeConfidence(userVectorObj.droppedCount, userVectorObj.totalDimensions);
        const classification = classifyCareerInclination(userVectorObj);

        res.json({
            success: true,
            inclination: classification.inclination,
            confidence: confidence,
            rationale: classification.rationale,
            vectorBreakdown: {
                academicScore: userVectorObj.raw.academicStrength !== null ? Math.round(userVectorObj.raw.academicStrength * 100) : null,
                practicalSkillScore: userVectorObj.raw.practicalSkill !== null ? Math.round(userVectorObj.raw.practicalSkill * 100) : null,
                traitFitScore: userVectorObj.raw.traitFit !== null ? Math.round(userVectorObj.raw.traitFit * 100) : null,
                projectEvidenceScore: userVectorObj.raw.projectEvidence !== null ? Math.round(userVectorObj.raw.projectEvidence * 100) : null,
            },
            oceanTraits: userVectorObj.ocean,
            activeDimensionsCount: userVectorObj.activeDimensions.length,
        });
    } catch (error) {
        console.error('Error computing career analysis:', error);
        res.status(500).json({ error: 'Failed to compute career analysis' });
    }
});

export default router;
