-- This file contains example SQL queries for testing and development
-- You can run these in Neon SQL Editor or Drizzle Studio

-- View all users
SELECT id, clerk_id, email, first_name, last_name, onboarding_completed, created_at
FROM users
ORDER BY created_at DESC;

-- View academic records for a specific user
SELECT ar.*, u.email
FROM academic_records ar
JOIN users u ON ar.user_id = u.id
ORDER BY ar.semester DESC;

-- View coding profiles
SELECT cp.*, u.email
FROM coding_profiles cp
JOIN users u ON cp.user_id = u.id;

-- View all projects with user info
SELECT p.*, u.email, u.first_name, u.last_name
FROM projects p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- View psychometric test results
SELECT pt.*, u.email
FROM psychometric_tests pt
JOIN users u ON pt.user_id = u.id
WHERE pt.taken_at IS NOT NULL;

-- View recommendations
SELECT r.*, u.email
FROM recommendations r
JOIN users u ON r.user_id = u.id
ORDER BY r.generated_at DESC;

-- View roadmaps
SELECT rm.id, rm.title, rm.target_role, rm.generated_at, u.email
FROM roadmaps rm
JOIN users u ON rm.user_id = u.id
ORDER BY rm.generated_at DESC;

-- View onboarding completion status
SELECT u.email, u.first_name, u.onboarding_completed, od.completed_at
FROM users u
LEFT JOIN onboarding_data od ON u.id = od.user_id
ORDER BY u.created_at DESC;

-- Count records by type for each user
SELECT 
    u.email,
    COUNT(DISTINCT ar.id) as academic_records,
    COUNT(DISTINCT p.id) as projects,
    CASE WHEN cp.id IS NOT NULL THEN 1 ELSE 0 END as has_coding_profile,
    CASE WHEN pt.id IS NOT NULL THEN 1 ELSE 0 END as has_psych_test,
    CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as has_recommendations,
    CASE WHEN rm.id IS NOT NULL THEN 1 ELSE 0 END as has_roadmap
FROM users u
LEFT JOIN academic_records ar ON u.id = ar.user_id
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN coding_profiles cp ON u.id = cp.user_id
LEFT JOIN psychometric_tests pt ON u.id = pt.user_id
LEFT JOIN recommendations r ON u.id = r.user_id
LEFT JOIN roadmaps rm ON u.id = rm.user_id
GROUP BY u.id, u.email, cp.id, pt.id, r.id, rm.id
ORDER BY u.created_at DESC;

-- Clean up test data (CAREFUL!)
-- Uncomment and run only if you want to delete all data
-- DELETE FROM academic_records;
-- DELETE FROM coding_profiles;
-- DELETE FROM projects;
-- DELETE FROM psychometric_tests;
-- DELETE FROM recommendations;
-- DELETE FROM roadmaps;
-- DELETE FROM onboarding_data;
-- DELETE FROM users WHERE email LIKE '%test%';
