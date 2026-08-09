-- V4 and V5 created eligible_students/invitations with BIGSERIAL, which
-- makes Postgres generate its own internal sequence (e.g.
-- eligible_students_id_seq). But GenerationType.AUTO on these entities
-- makes Hibernate look for (and call nextval() on) a sequence named
-- exactly "<table>_seq" -- same pattern V1 already used for users_seq.
-- That sequence never existed for these two tables, so schema validation
-- failed on startup. This adds the missing sequences without touching the
-- already-applied V4/V5 files.

CREATE SEQUENCE IF NOT EXISTS eligible_students_seq START WITH 1 INCREMENT BY 50;
CREATE SEQUENCE IF NOT EXISTS invitations_seq START WITH 1 INCREMENT BY 50;
