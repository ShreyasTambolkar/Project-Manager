-- Migration 006: Create departments table
-- Date: 2026-07-03
-- Extracts unique departments from existing projects data

CREATE TABLE IF NOT EXISTS departments (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,
    location   VARCHAR(100) DEFAULT NULL
);

-- Populate from existing project data
INSERT IGNORE INTO departments (name) VALUES
    ('Strategy'),
    ('Finance'),
    ('Quality'),
    ('Maintenance'),
    ('Stores'),
    ('HR');
