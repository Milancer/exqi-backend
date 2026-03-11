-- Drop the problematic FK constraint
ALTER TABLE competencies DROP CONSTRAINT IF EXISTS "FK_fdf5bd370a4603c59cb6491c200";
