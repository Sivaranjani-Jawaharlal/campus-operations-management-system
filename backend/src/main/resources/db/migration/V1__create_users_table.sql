CREATE SEQUENCE IF NOT EXISTS users_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE IF NOT EXISTS users
(
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    enabled boolean NOT NULL DEFAULT false,
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    verification_code character varying(255),
    verification_expiration timestamp(6) without time zone,
    verification_attempts integer NOT NULL DEFAULT 0,
    reset_password_token character varying(255),
    reset_password_token_expires_at timestamp(6) without time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_username UNIQUE (username)
    );