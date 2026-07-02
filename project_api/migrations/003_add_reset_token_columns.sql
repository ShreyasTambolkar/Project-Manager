-- Migration 003: Add password-reset columns to users_12
-- Date: 2026-07-02
-- Note: These columns are included in 002, but this migration exists
--       for databases that were created before reset-token support was added.
--       The procedure safely skips if the columns already exist.

DELIMITER //

CREATE PROCEDURE add_column_if_not_exists()
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'users_12' AND COLUMN_NAME = 'reset_token'
    ) THEN
        ALTER TABLE users_12 ADD COLUMN reset_token VARCHAR(100) DEFAULT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'users_12' AND COLUMN_NAME = 'reset_token_expiry'
    ) THEN
        ALTER TABLE users_12 ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;
    END IF;
END //

DELIMITER ;

CALL add_column_if_not_exists();
DROP PROCEDURE IF EXISTS add_column_if_not_exists;
