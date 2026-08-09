-- Pins each eligible_students row to a specific institutional email.
-- Signup now requires this to match exactly, not just roll number + DOB --
-- otherwise anyone who knows/guesses a roll number + DOB could sign up
-- with their own email and permanently consume that student's roll number
-- (usedForSignup=true), locking the real student out.

ALTER TABLE eligible_students ADD COLUMN email VARCHAR(255);

-- Any rows uploaded before this migration have no email on file and can no
-- longer complete signup until an admin re-uploads them with a real email.
-- Backfilling to a placeholder (rather than leaving NULL) keeps the
-- NOT NULL constraint below from failing on existing data.
UPDATE eligible_students SET email = 'unset+' || roll_number || '@example.invalid' WHERE email IS NULL;

ALTER TABLE eligible_students ALTER COLUMN email SET NOT NULL;
