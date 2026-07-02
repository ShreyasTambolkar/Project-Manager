-- Migration 002: Create the users_12 table
-- Date: 2026-07-02

CREATE TABLE IF NOT EXISTS users_12 (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    email               VARCHAR(255) UNIQUE NOT NULL,
    password            VARCHAR(255) NOT NULL,
    reset_token         VARCHAR(100) DEFAULT NULL,
    reset_token_expiry  DATETIME     DEFAULT NULL
);
