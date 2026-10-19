import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function run() {
    console.log('Applying non-destructive schema migrations...');
    await sql`
        ALTER TABLE roadmaps 
        ADD COLUMN IF NOT EXISTS description TEXT,
        ADD COLUMN IF NOT EXISTS target_role VARCHAR(100);
    `;
    console.log('✅ roadmaps table columns verified/added.');

    await sql`
        ALTER TABLE roadmap_items 
        ADD COLUMN IF NOT EXISTS phase VARCHAR(100),
        ADD COLUMN IF NOT EXISTS title VARCHAR(255),
        ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS estimated_weeks INTEGER;
    `;
    console.log('✅ roadmap_items table columns verified/added.');

    // Also add confidence column to recommendations for Phase 4
    await sql`
        ALTER TABLE recommendations
        ADD COLUMN IF NOT EXISTS confidence DECIMAL(5, 2) DEFAULT 1.0;
    `;
    console.log('✅ recommendations table confidence column verified/added.');

    console.log('All migrations applied successfully!');
}

run().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
