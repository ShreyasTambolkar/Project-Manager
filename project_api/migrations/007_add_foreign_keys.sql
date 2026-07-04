-- Migration 007: Add foreign key columns linking to departments
-- Date: 2026-07-03
-- Adds department_id FK to projects and users_12
-- Keeps all existing columns intact — no data or behavior change

-- Add department_id to projects
ALTER TABLE projects ADD COLUMN department_id INT DEFAULT NULL;

-- Populate department_id from existing department text
UPDATE projects p
    JOIN departments d ON p.department = d.name
    SET p.department_id = d.id;

-- Add FK constraint
ALTER TABLE projects ADD CONSTRAINT fk_projects_department
    FOREIGN KEY (department_id) REFERENCES departments(id);

-- Add department_id to users_12
ALTER TABLE users_12 ADD COLUMN department_id INT DEFAULT NULL;

-- Add FK constraint
ALTER TABLE users_12 ADD CONSTRAINT fk_users_department
    FOREIGN KEY (department_id) REFERENCES departments(id);
