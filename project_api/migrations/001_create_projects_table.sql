-- Migration 001: Create the projects table
-- Date: 2026-07-02

CREATE TABLE IF NOT EXISTS projects (
    project_id   INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    start_date   DATE,
    end_date     DATE,
    reason       VARCHAR(255),
    type         VARCHAR(100),
    division     VARCHAR(100),
    category     VARCHAR(100),
    priority     VARCHAR(50),
    department   VARCHAR(100),
    location     VARCHAR(100),
    status       VARCHAR(100)
);
