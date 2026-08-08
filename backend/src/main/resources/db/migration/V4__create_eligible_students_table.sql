CREATE TABLE eligible_students (
    id BIGSERIAL PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    department VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    used_for_signup BOOLEAN NOT NULL DEFAULT FALSE
);