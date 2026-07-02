-- Migration 003: Add password-reset columns to users_12
-- Date: 2026-07-02
-- Note: These columns are included in 002, but this migration exists
--       for databases that were created before reset-token support was added.
--       If columns already exist, the runner will safely skip the error.

ALTER TABLE users_12 ADD COLUMN reset_token VARCHAR(100) DEFAULT NULL;
ALTER TABLE users_12 ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;
