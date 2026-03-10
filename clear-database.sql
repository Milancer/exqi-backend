-- Clear all data from Nexus tables before import
-- This prepares the database for EXQi data import
-- Drop tables that have schema changes to force TypeORM to recreate them

DO $$
BEGIN
    -- Drop tables that have schema changes (competency_id, skill_id)
    DROP TABLE IF EXISTS job_profile_competencies CASCADE;
    DROP TABLE IF EXISTS job_profile_skills CASCADE;

    -- Clear other job profile related tables
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_profile_deliverables') THEN
        TRUNCATE TABLE job_profile_deliverables CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_profile_requirements') THEN
        TRUNCATE TABLE job_profile_requirements CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_profiles') THEN
        TRUNCATE TABLE job_profiles CASCADE;
    END IF;

    -- Clear user tables
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_roles') THEN
        TRUNCATE TABLE user_roles CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'users') THEN
        TRUNCATE TABLE users CASCADE;
    END IF;

    -- Clear reference data tables
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'departments') THEN
        TRUNCATE TABLE departments CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_grades') THEN
        TRUNCATE TABLE job_grades CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'work_levels') THEN
        TRUNCATE TABLE work_levels CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'skills') THEN
        TRUNCATE TABLE skills CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'competencies') THEN
        TRUNCATE TABLE competencies CASCADE;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'competency_questions') THEN
        TRUNCATE TABLE competency_questions CASCADE;
    END IF;
END $$;

-- Verify tables are cleared
DO $$
DECLARE
    result TEXT;
BEGIN
    RAISE NOTICE 'Tables cleared successfully!';

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_profiles') THEN
        EXECUTE 'SELECT COUNT(*) FROM job_profiles' INTO result;
        RAISE NOTICE 'job_profiles: % rows', result;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'users') THEN
        EXECUTE 'SELECT COUNT(*) FROM users' INTO result;
        RAISE NOTICE 'users: % rows', result;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'departments') THEN
        EXECUTE 'SELECT COUNT(*) FROM departments' INTO result;
        RAISE NOTICE 'departments: % rows', result;
    END IF;

    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'competencies') THEN
        EXECUTE 'SELECT COUNT(*) FROM competencies' INTO result;
        RAISE NOTICE 'competencies: % rows', result;
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_profile_competencies') THEN
        RAISE NOTICE 'job_profile_competencies: DROPPED (will be recreated)';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'job_profile_skills') THEN
        RAISE NOTICE 'job_profile_skills: DROPPED (will be recreated)';
    END IF;
END $$;
