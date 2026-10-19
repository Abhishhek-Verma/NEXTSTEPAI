/**
 * User Data Service
 * Efficiently fetches complete user profile with all related data matching current normalized schema
 */

import db from '../db/index.js';
import { 
    users, 
    academicRecords, 
    codingProfiles, 
    psychometricTests, 
    projects, 
    recommendations, 
    roadmaps, 
    roadmapItems,
    onboardingData 
} from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Fetch complete user profile with all related data in a single optimized query
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Complete user profile object
 */
export async function fetchCompleteUserProfile(userId) {
    try {
        // Fetch user basic info
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId));

        if (!user) {
            throw new Error('User not found');
        }

        // Fetch all related data in parallel for efficiency
        const [
            academics,
            codingRows,
            psychometrics,
            userProjects,
            recRows,
            roadmapRows,
            onboarding
        ] = await Promise.all([
            // Academic records (multiple)
            db.select().from(academicRecords).where(eq(academicRecords.userId, userId)),
            
            // Coding profiles (multiple rows: one per platform)
            db.select().from(codingProfiles).where(eq(codingProfiles.userId, userId)),
            
            // Psychometric test (latest)
            db.select().from(psychometricTests).where(eq(psychometricTests.userId, userId)),
            
            // Projects (multiple)
            db.select().from(projects).where(eq(projects.userId, userId)),
            
            // Recommendations (multiple rows)
            db.select().from(recommendations).where(eq(recommendations.userId, userId)),
            
            // Roadmap (single)
            db.select().from(roadmaps).where(eq(roadmaps.userId, userId)),
            
            // Onboarding data (single)
            db.select().from(onboardingData).where(eq(onboardingData.userId, userId)).then(rows => rows[0] || null)
        ]);

        // Transform coding profiles into platform dictionary
        const platformMap = {
            github: null,
            leetcode: null,
            codeforces: null,
            codechef: null,
        };
        codingRows.forEach(row => {
            if (row.platform) {
                platformMap[row.platform] = {
                    profileUrl: row.profileUrl,
                    metrics: row.metrics || {},
                };
            }
        });

        // Fetch roadmap items if roadmap exists
        const roadmapRecord = roadmapRows[0] || null;
        let roadmapItemsList = [];
        if (roadmapRecord) {
            roadmapItemsList = await db
                .select()
                .from(roadmapItems)
                .where(eq(roadmapItems.roadmapId, roadmapRecord.id))
                .orderBy(roadmapItems.sequenceNo);
        }

        // Group recommendations
        const latestPsych = psychometrics.length > 0 ? psychometrics[psychometrics.length - 1] : null;
        const groupedRecs = {
            roles: recRows.filter(r => r.recType === 'role').map(r => {
                let parsed = {};
                try { parsed = JSON.parse(r.content); } catch (e) {}
                return { id: r.id, ...parsed, score: r.score, confidence: r.confidence, generatedAt: r.generatedAt };
            }),
            skills: recRows.filter(r => r.recType === 'skill').map(r => {
                let parsed = {};
                try { parsed = JSON.parse(r.content); } catch (e) {}
                return { id: r.id, ...parsed, score: r.score, confidence: r.confidence, generatedAt: r.generatedAt };
            }),
            companies: recRows.filter(r => r.recType === 'company').map(r => {
                let parsed = {};
                try { parsed = JSON.parse(r.content); } catch (e) {}
                return { id: r.id, ...parsed, score: r.score, confidence: r.confidence, generatedAt: r.generatedAt };
            }),
        };

        // Construct complete user profile object
        const completeProfile = {
            user: {
                id: user.id,
                clerkId: user.clerkId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                onboardingCompleted: user.onboardingCompleted,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            
            academic: {
                records: academics.map(record => ({
                    id: record.id,
                    semester: record.semester,
                    gpa: record.gpa ? parseFloat(record.gpa) : null,
                    details: record.details,
                    createdAt: record.createdAt
                })),
                summary: {
                    totalRecords: academics.length,
                    highestGpa: academics.length > 0 
                        ? Math.max(...academics.map(r => parseFloat(r.gpa) || 0))
                        : 0
                }
            },
            
            coding: {
                profiles: codingRows,
                platforms: platformMap,
                summary: {
                    platformsConnected: Object.keys(platformMap).filter(k => !!platformMap[k])
                }
            },
            
            projects: {
                list: userProjects.map(project => ({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    technologies: project.technologies || [],
                    repoUrl: project.repoUrl,
                    liveUrl: project.liveUrl,
                    imageUrl: project.imageUrl,
                    status: project.status,
                    completedAt: project.completedAt,
                    createdAt: project.createdAt
                })),
                summary: {
                    total: userProjects.length,
                    completed: userProjects.filter(p => p.status === 'completed').length,
                    inProgress: userProjects.filter(p => p.status === 'in-progress').length,
                }
            },
            
            psychometric: latestPsych ? {
                testName: latestPsych.testName,
                traits: latestPsych.traits || {},
                takenAt: latestPsych.takenAt,
                analysis: {
                    completed: true,
                    topTraits: latestPsych.traits 
                        ? Object.entries(latestPsych.traits)
                            .sort((a, b) => Number(b[1]) - Number(a[1]))
                            .slice(0, 5)
                            .map(([trait, score]) => ({ trait, score }))
                        : []
                }
            } : null,
            
            recommendations: {
                roles: groupedRecs.roles,
                skills: groupedRecs.skills,
                companies: groupedRecs.companies,
                summary: {
                    rolesCount: groupedRecs.roles.length,
                    skillsCount: groupedRecs.skills.length,
                    companiesCount: groupedRecs.companies.length
                }
            },
            
            roadmap: roadmapRecord ? {
                id: roadmapRecord.id,
                title: roadmapRecord.title,
                description: roadmapRecord.description,
                targetRole: roadmapRecord.targetRole,
                items: roadmapItemsList,
                generatedAt: roadmapRecord.generatedAt,
                summary: {
                    totalItems: roadmapItemsList.length,
                    completedItems: roadmapItemsList.filter(item => item.completed).length 
                }
            } : null,
            
            onboarding: onboarding ? {
                currentEducation: onboarding.currentEducation,
                graduationYear: onboarding.graduationYear,
                careerGoals: onboarding.careerGoals,
                interests: onboarding.interests,
                skills: onboarding.skills,
                experience: onboarding.experience,
                completedAt: onboarding.completedAt
            } : null,
            
            // Overall profile completion percentage
            profileCompletion: calculateProfileCompletion({
                user,
                academics,
                codingRows,
                latestPsych,
                userProjects,
                recRows,
                roadmapRecord,
                onboarding
            })
        };

        return completeProfile;
    } catch (error) {
        console.error('Error fetching complete user profile:', error);
        throw error;
    }
}

/**
 * Calculate profile completion percentage
 */
function calculateProfileCompletion(data) {
    const sections = [
        { name: 'Basic Info', weight: 10, complete: !!(data.user.firstName && data.user.lastName) },
        { name: 'Onboarding', weight: 15, complete: !!data.onboarding },
        { name: 'Academic', weight: 15, complete: data.academics.length > 0 },
        { name: 'Coding Profile', weight: 20, complete: data.codingRows.length > 0 },
        { name: 'Projects', weight: 15, complete: data.userProjects.length > 0 },
        { name: 'Psychometric', weight: 10, complete: !!data.latestPsych },
        { name: 'Recommendations', weight: 10, complete: data.recRows.length > 0 },
        { name: 'Roadmap', weight: 5, complete: !!data.roadmapRecord }
    ];

    const completedWeight = sections
        .filter(s => s.complete)
        .reduce((sum, s) => sum + s.weight, 0);

    return {
        percentage: completedWeight,
        sections: sections.map(s => ({
            name: s.name,
            weight: s.weight,
            complete: s.complete
        })),
        missingSection: sections.filter(s => !s.complete).map(s => s.name)
    };
}

/**
 * Fetch lightweight user profile (basic info only)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Basic user info
 */
export async function fetchBasicUserProfile(userId) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

    if (!user) {
        throw new Error('User not found');
    }

    return {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email,
        imageUrl: user.imageUrl,
        onboardingCompleted: user.onboardingCompleted
    };
}

export default {
    fetchCompleteUserProfile,
    fetchBasicUserProfile
};
