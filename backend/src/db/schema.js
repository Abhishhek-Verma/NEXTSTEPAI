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
    semester: integer('semester'),
    gpa: decimal('gpa', { precision: 3, scale: 2 }),
    details: text('details'), // Additional information about courses, achievements, etc.
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Coding Profiles table
export const codingProfiles = pgTable('coding_profiles', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    platform: varchar('platform', { length: 50 }), // github, leetcode, codeforces, codechef
    profileUrl: text('profile_url'),
    metrics: jsonb('metrics'), // Store all platform-specific metrics
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    repoUrl: text('repo_url'), // Match schema diagram
    liveUrl: text('live_url'),
    imageUrl: text('image_url'),
    status: varchar('status', { length: 50 }).default('in-progress'), // in-progress, completed
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Psychometric Tests table
export const psychometricTests = pgTable('psychometric_tests', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    testName: varchar('test_name', { length: 255 }).default('Career Traits Assessment'),
    traits: jsonb('traits'),
    takenAt: timestamp('taken_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Career Recommendations table
export const recommendations = pgTable('recommendations', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    recType: varchar('rec_type', { length: 100 }), // role, skill, course, certification, etc.
    content: text('content'),
    score: decimal('score', { precision: 5, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Roadmap table
export const roadmaps = pgTable('roadmaps', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
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

// Skills table - normalized skill management
export const skills = pgTable('skills', {
    id: serial('id').primaryKey(),
    skillName: varchar('skill_name', { length: 100 }).notNull().unique(),
    category: varchar('category', { length: 50 }), // technical, soft-skills, tools, languages, etc.
    createdAt: timestamp('created_at').defaultNow(),
});

// Student Skills junction table
export const studentSkills = pgTable('student_skills', {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    skillId: integer('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
    proficiencyLevel: integer('proficiency_level').default(1), // 1-5 scale
    lastPracticed: timestamp('last_practiced'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Project Skills junction table
export const projectSkills = pgTable('project_skills', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    skillId: integer('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Recommendation Skills junction table
export const recommendationSkills = pgTable('recommendation_skills', {
    id: serial('id').primaryKey(),
    recommendationId: integer('recommendation_id').notNull().references(() => recommendations.id, { onDelete: 'cascade' }),
    skillId: integer('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Roadmap Items table - normalized roadmap tasks
export const roadmapItems = pgTable('roadmap_items', {
    id: serial('id').primaryKey(),
    roadmapId: integer('roadmap_id').notNull().references(() => roadmaps.id, { onDelete: 'cascade' }),
    sequenceNo: integer('sequence_no').notNull(),
    taskType: varchar('task_type', { length: 50 }), // course, project, certification, skill, etc.
    description: text('description'),
    completed: boolean('completed').default(false),
    dueDate: timestamp('due_date'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Companies table - normalized company data
export const companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    companyId: integer('company_id').notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    domain: varchar('domain', { length: 100 }),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
    academicRecords: many(academicRecords),
    codingProfiles: many(codingProfiles),
    projects: many(projects),
    psychometricTests: many(psychometricTests),
    recommendations: many(recommendations),
    roadmap: one(roadmaps),
    onboarding: one(onboardingData),
    studentSkills: many(studentSkills),
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

export const psychometricTestsRelations = relations(psychometricTests, ({ one }) => ({
    user: one(users, {
        fields: [psychometricTests.userId],
        references: [users.id],
    }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    user: one(users, {
        fields: [projects.userId],
        references: [users.id],
    }),
    projectSkills: many(projectSkills),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
    studentSkills: many(studentSkills),
    projectSkills: many(projectSkills),
    recommendationSkills: many(recommendationSkills),
}));

export const studentSkillsRelations = relations(studentSkills, ({ one }) => ({
    student: one(users, {
        fields: [studentSkills.studentId],
        references: [users.id],
    }),
    skill: one(skills, {
        fields: [studentSkills.skillId],
        references: [skills.id],
    }),
}));

export const projectSkillsRelations = relations(projectSkills, ({ one }) => ({
    project: one(projects, {
        fields: [projectSkills.projectId],
        references: [projects.id],
    }),
    skill: one(skills, {
        fields: [projectSkills.skillId],
        references: [skills.id],
    }),
}));

export const recommendationsRelations = relations(recommendations, ({ one, many }) => ({
    user: one(users, {
        fields: [recommendations.userId],
        references: [users.id],
    }),
    recommendationSkills: many(recommendationSkills),
}));

export const recommendationSkillsRelations = relations(recommendationSkills, ({ one }) => ({
    recommendation: one(recommendations, {
        fields: [recommendationSkills.recommendationId],
        references: [recommendations.id],
    }),
    skill: one(skills, {
        fields: [recommendationSkills.skillId],
        references: [skills.id],
    }),
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
    user: one(users, {
        fields: [roadmaps.userId],
        references: [users.id],
    }),
    roadmapItems: many(roadmapItems),
}));

export const roadmapItemsRelations = relations(roadmapItems, ({ one }) => ({
    roadmap: one(roadmaps, {
        fields: [roadmapItems.roadmapId],
        references: [roadmaps.id],
    }),
}));
