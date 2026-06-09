-- ════════════════════════════════════════════════════════════════════
-- Migration: Add RACI flags to job_profile_business_processes
-- ════════════════════════════════════════════════════════════════════
-- Run this against the Railway production database BEFORE deploying
-- the new backend build. TypeORM `synchronize` is disabled in
-- production (see app.module.ts), so the four new columns won't be
-- auto-added on startup. Without them the new build will fail on any
-- read/write of a JP's Business Processes.
--
-- This migration is purely additive — every column gets a `DEFAULT false`
-- so existing rows backfill instantly to "no RACI tag set yet" and the
-- new code reads them as plain booleans. No data is overwritten.
--
-- Safe to re-run: each ADD COLUMN uses IF NOT EXISTS.
-- ════════════════════════════════════════════════════════════════════

BEGIN;

ALTER TABLE job_profile_business_processes
  ADD COLUMN IF NOT EXISTS is_responsible BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_accountable BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_consulted   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_informed    BOOLEAN NOT NULL DEFAULT false;

COMMIT;
