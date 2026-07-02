-- Migration 004: Seed sample users (projects are seeded via Python due to randomization)
-- Date: 2026-07-02
-- Passwords are SHA-256 hashes:
--   Alice@123 → 2549c825093e5a1e4e5df28e4e2363b49176e0a9092b98a0a0de2480a9a16b48
--   Bob@456   → 0bfe935e70c321c7ca3afc75ce0d0ca2f98b5422e008bb31c00c6d7f1f1c0ad6

INSERT IGNORE INTO users_12 (email, password) VALUES
    ('alice@projects.com', '2549c825093e5a1e4e5df28e4e2363b49176e0a9092b98a0a0de2480a9a16b48'),
    ('bob@projects.com',   '0bfe935e70c321c7ca3afc75ce0d0ca2f98b5422e008bb31c00c6d7f1f1c0ad6');
