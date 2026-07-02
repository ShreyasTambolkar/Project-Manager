-- Migration 005: Add indexes on frequently queried columns
-- Date: 2026-07-02

CREATE INDEX idx_projects_status ON projects (status);
CREATE INDEX idx_projects_department ON projects (department);
CREATE INDEX idx_projects_priority ON projects (priority);
CREATE INDEX idx_projects_location ON projects (location);
CREATE INDEX idx_projects_name ON projects (project_name);
