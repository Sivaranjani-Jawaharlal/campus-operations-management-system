CREATE TABLE invitations (
    id BIGSERIAL PRIMARY KEY,
    invited_email VARCHAR(255) NOT NULL,
     role VARCHAR(20) NOT NULL,
     token VARCHAR(255) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_invitations_invited_email ON invitations (invited_email);