import { pgTable, text, serial, integer, timestamp, jsonb, boolean, decimal, varchar, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - stores Clerk user IDs and profile info
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    imageUrl: text('image_url'),
    onboardingCompleted: boolean('onboarding_completed').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Academic Records table
export const academicRecords = pgTable('academic_records', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    degree: varchar('degree', { length: 100 }),
    institution: varchar('institution', { length: 255 }),
    major: varchar('major', { length: 100 }),
    semester: integer('semester'),
    gpa: decimal('gpa', { precision: 3, scale: 2 }),
    maxGpa: decimal('max_gpa', { precision: 3, scale: 2 }).default('4.00'),
    startDate: varchar('start_date', { length: 50 }),
    endDate: varchar('end_date', { length: 50 }),
    isCurrentlyEnrolled: boolean('is_currently_enrolled').default(false),
    additionalInfo: jsonb('additional_info'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Coding Profiles table
export const codingProfiles = pgTable('coding_profiles', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    
    // GitHub
    githubUsername: varchar('github_username', { length: 100 }),
    githubProfileUrl: text('github_profile_url'),
    githubMetrics: jsonb('github_metrics'),
    
    // LeetCode
    leetcodeUsername: varchar('leetcode_username', { length: 100 }),
    leetcodeProfileUrl: text('leetcode_profile_url'),
    leetcodeMetrics: jsonb('leetcode_metrics'),
    
    // Codeforces
    codeforcesHandle: varchar('codeforces_handle', { length: 100 }),
    codeforcesProfileUrl: text('codeforces_profile_url'),
    codeforcesMetrics: jsonb('codeforces_metrics'),
    
    // CodeChef
    codechefHandle: varchar('codechef_handle', { length: 100 }),
    codechefProfileUrl: text('codechef_profile_url'),
    codechefMetrics: jsonb('codechef_metrics'),
    
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    technologies: jsonb('technologies'),
    githubUrl: text('github_url'),
    liveUrl: text('live_url'),
    imageUrl: text('image_url'),
    status: varchar('status', { length: 50 }).default('completed'), // completed, in-progress, planned
    startDate: varchar('start_date', { length: 50 }),
    endDate: varchar('end_date', { length: 50 }),
    featured: boolean('featured').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Psychometric Tests table
export const psychometricTests = pgTable('psychometric_tests', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    testName: varchar('test_name', { length: 255 }).default('Career Traits Assessment'),
    traits: jsonb('traits'),
    score: integer('score').default(0),
    progress: integer('progress').default(0),
    responses: jsonb('responses'),
    takenAt: timestamp('taken_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Career Recommendations table
export const recommendations = pgTable('recommendations', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    roles: jsonb('roles'),
    skills: jsonb('skills'),
    companies: jsonb('companies'),
    savedRoles: jsonb('saved_roles'),
    generatedAt: timestamp('generated_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Roadmap table
export const roadmaps = pgTable('roadmaps', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    targetRole: varchar('target_role', { length: 255 }),
    items: jsonb('items'),
    generatedAt: timestamp('generated_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Onboarding Data table
export const onboardingData = pgTable('onboarding_data', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    currentEducation: varchar('current_education', { length: 100 }),
    graduationYear: integer('graduation_year'),
    careerGoals: jsonb('career_goals'),
    interests: jsonb('interests'),
    skills: jsonb('skills'),
    experience: text('experience'),
    completedAt: timestamp('completed_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
    academicRecords: many(academicRecords),
    codingProfile: one(codingProfiles),
    projects: many(projects),
    psychometricTest: one(psychometricTests),
    recommendations: one(recommendations),
    roadmap: one(roadmaps),
    onboarding: one(onboardingData),
}));

export const academicRecordsRelations = relations(academicRecords, ({ one }) => ({
    user: one(users, {
        fields: [academicRecords.userId],
        references: [users.id],
    }),
}));

export const codingProfilesRelations = relations(codingProfiles, ({ one }) => ({
    user: one(users, {
        fields: [codingProfiles.userId],
        references: [users.id],
    }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
}));
