import { z } from 'zod';

// Middleware to validate request body against a Zod schema
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
};

// Common validation schemas
export const academicRecordSchema = z.object({
    records: z.array(z.object({
        id: z.number().optional(),
        degree: z.string().optional(),
        institution: z.string().optional(),
        major: z.string().optional(),
        semester: z.number().optional(),
        gpa: z.number().min(0).max(10).optional(),
        maxGpa: z.number().min(0).max(10).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        isCurrentlyEnrolled: z.boolean().optional(),
    })),
});

export const codingProfileSchema = z.object({
    platforms: z.object({
        github: z.object({
            username: z.string().optional(),
            profileUrl: z.string().url().optional(),
            metrics: z.any().optional(),
        }).optional(),
        leetcode: z.object({
            username: z.string().optional(),
            profileUrl: z.string().url().optional(),
            metrics: z.any().optional(),
        }).optional(),
        codeforces: z.object({
            handle: z.string().optional(),
            profileUrl: z.string().url().optional(),
            metrics: z.any().optional(),
        }).optional(),
        codechef: z.object({
            handle: z.string().optional(),
            profileUrl: z.string().url().optional(),
            metrics: z.any().optional(),
        }).optional(),
    }),
});

export const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    githubUrl: z.string().url().optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    featured: z.boolean().default(false),
});

export const psychometricSchema = z.object({
    testName: z.string().optional(),
    traits: z.any().optional(),
    score: z.number().optional(),
    progress: z.number().min(0).max(100).optional(),
    responses: z.any().optional(),
});

export const roadmapSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    targetRole: z.string().optional(),
    items: z.array(z.any()),
});

export const onboardingSchema = z.object({
    currentEducation: z.string().optional(),
    graduationYear: z.number().min(1900).max(2100).optional(),
    careerGoals: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.string().optional(),
});
