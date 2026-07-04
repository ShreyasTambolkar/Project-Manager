-- Migration 008: Remove unused location column from departments
-- Date: 2026-07-03

ALTER TABLE departments DROP COLUMN location;
