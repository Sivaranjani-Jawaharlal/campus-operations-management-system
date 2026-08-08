-- Fixes rows created before verification_attempts/enabled had defaults enforced.
-- Hibernate's ddl-auto=update added these columns without backfilling existing
-- rows, leaving NULL in a column mapped to a Java primitive (int/boolean),
-- which crashes on read with:
--   "Null value was assigned to a property of primitive type"

UPDATE users SET verification_attempts = 0 WHERE verification_attempts IS NULL;
UPDATE users SET enabled = false WHERE enabled IS NULL;

ALTER TABLE users ALTER COLUMN verification_attempts SET DEFAULT 0;
ALTER TABLE users ALTER COLUMN verification_attempts SET NOT NULL;

ALTER TABLE users ALTER COLUMN enabled SET DEFAULT false;
ALTER TABLE users ALTER COLUMN enabled SET NOT NULL;