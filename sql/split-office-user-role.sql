-- ════════════════════════════════════════════════════════════════════
-- Migration: Split OFFICE_USER role into JOB_PROFILE_USER + CBI_USER
-- ════════════════════════════════════════════════════════════════════
-- Run this against the Railway production database BEFORE deploying the
-- new backend build. The new build removes OFFICE_USER from the UserRole
-- enum, so any rows still carrying that value will break the entity
-- mapping on startup.
--
-- The split decision is data-driven: we look at the existing per-user
-- `modules` column. If it contains 'Competency Based Interview' we map
-- the user to CBI_USER; otherwise we map to JOB_PROFILE_USER (which is
-- the intuitive default — most existing OFFICE_USER rows are JP users).
--
-- Safe to re-run: each step is idempotent (IF NOT EXISTS / WHERE clauses
-- gate the work).
-- ════════════════════════════════════════════════════════════════════

BEGIN;

-- 1) Add the new enum values up-front so the UPDATEs below can succeed
--    while the old OFFICE_USER value is still part of the enum.
ALTER TYPE "user_role_enum" ADD VALUE IF NOT EXISTS 'JOB_PROFILE_USER';
ALTER TYPE "user_role_enum" ADD VALUE IF NOT EXISTS 'CBI_USER';

COMMIT;

-- ──────────────────────────────────────────────────────────────────
-- 2) Migrate existing OFFICE_USER rows. Postgres requires committing
--    new enum values before they can be referenced in UPDATEs, hence
--    the COMMIT above.
-- ──────────────────────────────────────────────────────────────────
BEGIN;

UPDATE "user"
SET    role = 'CBI_USER'
WHERE  role = 'OFFICE_USER'
  AND  COALESCE(modules, '') LIKE '%Competency Based Interview%';

UPDATE "user"
SET    role = 'JOB_PROFILE_USER'
WHERE  role = 'OFFICE_USER';

-- 3) Recreate the enum cleanly without OFFICE_USER. Postgres has no
--    `ALTER TYPE ... DROP VALUE`, so we cast to text, drop, recreate,
--    and cast back.
ALTER TABLE "user" ALTER COLUMN role TYPE text;

DROP TYPE "user_role_enum";

CREATE TYPE "user_role_enum" AS ENUM (
  'ADMIN',
  'OFFICE_MANAGER',
  'OFFICE_REVIEWER',
  'JOB_PROFILE_USER',
  'CBI_USER'
);

ALTER TABLE "user"
  ALTER COLUMN role TYPE "user_role_enum"
  USING role::"user_role_enum";

ALTER TABLE "user"
  ALTER COLUMN role SET DEFAULT 'JOB_PROFILE_USER';

COMMIT;
