/**
 * User Data Service
 * Efficiently fetches complete user profile with all related data
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
            codingProfile,
            psychometric,
            userProjects,
            recommendation,
            roadmap,
            onboarding
        ] = await Promise.all([
            // Academic records (multiple)
            db.select()
                .from(academicRecords)
                .where(eq(academicRecords.userId, userId)),
            
            // Coding profile (single)
            db.select()
                .from(codingProfiles)
                .where(eq(codingProfiles.userId, userId))
                .then(rows => rows[0] || null),
            
            // Psychometric test (single)
            db.select()
                .from(psychometricTests)
                .where(eq(psychometricTests.userId, userId))
                .then(rows => rows[0] || null),
            
            // Projects (multiple)
            db.select()
                .from(projects)
                .where(eq(projects.userId, userId)),
            
            // Recommendations (single)
            db.select()
                .from(recommendations)
                .where(eq(recommendations.userId, userId))
                .then(rows => rows[0] || null),
            
            // Roadmap (single)
            db.select()
                .from(roadmaps)
                .where(eq(roadmaps.userId, userId))
                .then(rows => rows[0] || null),
            
            // Onboarding data (single)
            db.select()
                .from(onboardingData)
                .where(eq(onboardingData.userId, userId))
                .then(rows => rows[0] || null)
        ]);

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
                    degree: record.degree,
                    institution: record.institution,
                    major: record.major,
                    semester: record.semester,
                    gpa: parseFloat(record.gpa),
                    maxGpa: parseFloat(record.maxGpa),
                    startDate: record.startDate,
                    endDate: record.endDate,
                    isCurrentlyEnrolled: record.isCurrentlyEnrolled,
                    additionalInfo: record.additionalInfo,
                    createdAt: record.createdAt
                })),
                summary: {
                    totalRecords: academics.length,
                    currentInstitution: academics.find(r => r.isCurrentlyEnrolled)?.institution || null,
                    highestGpa: academics.length > 0 
                        ? Math.max(...academics.map(r => parseFloat(r.gpa) || 0))
                        : 0
                }
            },
            
            coding: {
                profile: codingProfile || null,
                platforms: codingProfile ? {
                    github: {
                        username: codingProfile.githubUsername,
                        profileUrl: codingProfile.githubProfileUrl,
                        metrics: codingProfile.githubMetrics
                    },
                    leetcode: {
                        username: codingProfile.leetcodeUsername,
                        profileUrl: codingProfile.leetcodeProfileUrl,
                        metrics: codingProfile.leetcodeMetrics
                    },
                    codeforces: {
                        handle: codingProfile.codeforcesHandle,
                        profileUrl: codingProfile.codeforcesProfileUrl,
                        metrics: codingProfile.codeforcesMetrics
                    },
                    codechef: {
                        handle: codingProfile.codechefHandle,
                        profileUrl: codingProfile.codechefProfileUrl,
                        metrics: codingProfile.codechefMetrics
                    }
                } : null,
                summary: {
                    platformsConnected: codingProfile ? [
                        codingProfile.githubUsername ? 'github' : null,
                        codingProfile.leetcodeUsername ? 'leetcode' : null,
                        codingProfile.codeforcesHandle ? 'codeforces' : null,
                        codingProfile.codechefHandle ? 'codechef' : null
                    ].filter(Boolean) : []
                }
            },
            
            projects: {
                list: userProjects.map(project => ({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    technologies: project.technologies,
                    githubUrl: project.githubUrl,
                    liveUrl: project.liveUrl,
                    imageUrl: project.imageUrl,
                    status: project.status,
                    startDate: project.startDate,
                    endDate: project.endDate,
                    featured: project.featured,
                    createdAt: project.createdAt
                })),
                summary: {
                    total: userProjects.length,
                    completed: userProjects.filter(p => p.status === 'completed').length,
                    inProgress: userProjects.filter(p => p.status === 'in-progress').length,
                    featured: userProjects.filter(p => p.featured).length
                }
            },
            
            psychometric: psychometric ? {
                testName: psychometric.testName,
                traits: psychometric.traits,
                score: psychometric.score,
                progress: psychometric.progress,
                responses: psychometric.responses,
                takenAt: psychometric.takenAt,
                analysis: {
                    completed: psychometric.progress === 100,
                    topTraits: psychometric.traits 
                        ? Object.entries(psychometric.traits)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([trait, score]) => ({ trait, score }))
                        : []
                }
            } : null,
            
            recommendations: recommendation ? {
                roles: recommendation.roles,
                skills: recommendation.skills,
                companies: recommendation.companies,
                savedRoles: recommendation.savedRoles,
                generatedAt: recommendation.generatedAt,
                summary: {
                    rolesCount: recommendation.roles ? recommendation.roles.length : 0,
                    skillsCount: recommendation.skills ? recommendation.skills.length : 0,
                    companiesCount: recommendation.companies ? recommendation.companies.length : 0
                }
            } : null,
            
            roadmap: roadmap ? {
                title: roadmap.title,
                description: roadmap.description,
                targetRole: roadmap.targetRole,
                items: roadmap.items,
                generatedAt: roadmap.generatedAt,
                summary: {
                    totalItems: roadmap.items ? roadmap.items.length : 0,
                    completedItems: roadmap.items 
                        ? roadmap.items.filter(item => item.completed).length 
                        : 0
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
                codingProfile,
                psychometric,
                userProjects,
                recommendation,
                roadmap,
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
        { name: 'Coding Profile', weight: 20, complete: !!data.codingProfile },
        { name: 'Projects', weight: 15, complete: data.userProjects.length > 0 },
        { name: 'Psychometric', weight: 10, complete: !!data.psychometric },
        { name: 'Recommendations', weight: 10, complete: !!data.recommendation },
        { name: 'Roadmap', weight: 5, complete: !!data.roadmap }
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
 * Fetch user by Clerk ID (for authentication)
 * @param {string} clerkId - Clerk user ID
 * @returns {Promise<Object>} Complete user profile
 */
export async function fetchUserByClerkId(clerkId) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkId));

    if (!user) {
        throw new Error('User not found');
    }

    return fetchCompleteUserProfile(user.id);
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
    fetchUserByClerkId,
    fetchBasicUserProfile
};
