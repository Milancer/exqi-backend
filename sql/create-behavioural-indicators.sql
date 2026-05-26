-- ════════════════════════════════════════════════════════════════════
-- Migration: Create bi_competencies + bi_levels for the CBI
--            "Behavioural Indicators" reference page.
-- ════════════════════════════════════════════════════════════════════
-- Run this against the Railway production database BEFORE deploying the
-- new backend build. TypeORM `synchronize` is disabled in production
-- (see app.module.ts), so the two new tables won't be auto-created on
-- startup; the new /api/behavioural-indicators endpoint will fail until
-- this script has run.
--
-- After running this and deploying the backend, populate the data with:
--   npm run seed:behavioural-indicators
-- (against the same prod database). The seed wipes both tables and
-- re-inserts from src/behavioural-indicators/seed-data.ts, so editing
-- the seed file + re-running is the supported workflow.
--
-- Safe to re-run: every statement uses IF NOT EXISTS.
-- ════════════════════════════════════════════════════════════════════

BEGIN;

-- ── Parent table: one row per competency ───────────────────────────
CREATE TABLE IF NOT EXISTS bi_competencies (
  bi_competency_id  SERIAL PRIMARY KEY,
  category          VARCHAR(255) NOT NULL,
  competency_name   VARCHAR(255) NOT NULL,
  description       TEXT,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bi_competencies_sort_order
  ON bi_competencies (sort_order);

-- ── Child table: one row per (competency × proficiency level) ──────
-- `indicators` stores a JSON-serialised string[] (TypeORM `simple-json`
-- maps to a plain TEXT column).
CREATE TABLE IF NOT EXISTS bi_levels (
  bi_level_id       SERIAL PRIMARY KEY,
  bi_competency_id  INTEGER NOT NULL
                    REFERENCES bi_competencies (bi_competency_id)
                    ON DELETE CASCADE,
  level             INTEGER NOT NULL,
  level_label       VARCHAR(100) NOT NULL,
  level_subtitle    TEXT,
  indicators        TEXT NOT NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bi_levels_competency
  ON bi_levels (bi_competency_id);

COMMIT;
