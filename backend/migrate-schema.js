/**
 * Schema Migration Script
 * Migrates from old JSONB-based schema to normalized schema with junction tables
 */

import db from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function migrateSchema() {
    console.log('🚀 Starting schema migration...\n');

    try {
        // Step 1: Drop all existing tables to start fresh
        console.log('📦 Dropping existing tables...');
        await db.execute(sql`DROP SCHEMA public CASCADE`);
        await db.execute(sql`CREATE SCHEMA public`);
        console.log('✅ Clean slate created\n');

        // Step 2: Create new normalized tables
        console.log('🏗️  Creating new table structure...');
        
        // Users table
        await db.execute(sql`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                clerk_id VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                image_url TEXT,
                onboarding_completed BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Academic Records
        await db.execute(sql`
            CREATE TABLE academic_records (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                semester INTEGER,
                gpa DECIMAL(3, 2),
                details TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Coding Profiles (normalized - one row per platform)
        await db.execute(sql`
            CREATE TABLE coding_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                platform VARCHAR(50),
                profile_url TEXT,
                metrics JSONB,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Projects
        await db.execute(sql`
            CREATE TABLE projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                repo_url TEXT,
                live_url TEXT,
                image_url TEXT,
                status VARCHAR(50) DEFAULT 'in-progress',
                completed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Skills
        await db.execute(sql`
            CREATE TABLE skills (
                id SERIAL PRIMARY KEY,
                skill_name VARCHAR(100) NOT NULL UNIQUE,
                category VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Student Skills junction
        await db.execute(sql`
            CREATE TABLE student_skills (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
                proficiency_level INTEGER DEFAULT 1,
                last_practiced TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Project Skills junction
        await db.execute(sql`
            CREATE TABLE project_skills (
                id SERIAL PRIMARY KEY,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Psychometric Tests
        await db.execute(sql`
            CREATE TABLE psychometric_tests (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                test_name VARCHAR(255) DEFAULT 'Career Traits Assessment',
                traits JSONB,
                taken_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Recommendations (normalized)
        await db.execute(sql`
            CREATE TABLE recommendations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                rec_type VARCHAR(100),
                content TEXT,
                score DECIMAL(5, 2),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Recommendation Skills junction
        await db.execute(sql`
            CREATE TABLE recommendation_skills (
                id SERIAL PRIMARY KEY,
                recommendation_id INTEGER NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
                skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Roadmaps
        await db.execute(sql`
            CREATE TABLE roadmaps (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                generated_at TIMESTAMP DEFAULT NOW(),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Roadmap Items
        await db.execute(sql`
            CREATE TABLE roadmap_items (
                id SERIAL PRIMARY KEY,
                roadmap_id INTEGER NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
                sequence_no INTEGER NOT NULL,
                task_type VARCHAR(50),
                description TEXT,
                completed BOOLEAN DEFAULT false,
                due_date TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Companies
        await db.execute(sql`
            CREATE TABLE companies (
                id SERIAL PRIMARY KEY,
                company_id INTEGER NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                domain VARCHAR(100),
                notes TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        // Onboarding Data
        await db.execute(sql`
            CREATE TABLE onboarding_data (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                current_education VARCHAR(100),
                graduation_year INTEGER,
                career_goals JSONB,
                interests JSONB,
                skills JSONB,
                experience TEXT,
                completed_at TIMESTAMP DEFAULT NOW(),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('✅ All tables created successfully\n');
        console.log('🎉 Migration completed! Database is ready for use.\n');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

// Run migration
migrateSchema()
    .then(() => {
        console.log('✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
