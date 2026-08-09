-- Read-only offboarding for graduated students and departed staff/lab
-- assistants -- separate from `enabled` (email verification) and from
-- role/department/academicYear (which stay unchanged for historical
-- record-keeping). An INACTIVE account can still log in and view existing
-- data (see SecurityConfiguration), it just can't perform write actions.

ALTER TABLE users ADD COLUMN account_status VARCHAR(20);

UPDATE users SET account_status = 'ACTIVE' WHERE account_status IS NULL;

ALTER TABLE users ALTER COLUMN account_status SET NOT NULL;
ALTER TABLE users ALTER COLUMN account_status SET DEFAULT 'ACTIVE';