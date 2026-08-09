CREATE SEQUENCE IF NOT EXISTS announcements_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE announcements (
                               id bigint NOT NULL PRIMARY KEY,
                               title VARCHAR(255) NOT NULL,
                               content TEXT NOT NULL,
                               target_department VARCHAR(100),
                               target_academic_year VARCHAR(20),
                               created_by_email VARCHAR(255) NOT NULL,
                               created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_announcements_created_at ON announcements (created_at DESC);