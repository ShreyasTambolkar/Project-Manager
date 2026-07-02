# Database Schema

Database: MySQL
Database name: project_db


## Tables

### projects

| Column       | Type         | Notes                |
|--------------|--------------|----------------------|
| project_id   | INT          | Primary key, auto-increment |
| project_name | VARCHAR(255) | Not null             |
| start_date   | DATE         |                      |
| end_date     | DATE         |                      |
| reason       | VARCHAR(255) | Business, Dealership, Transport, Compliance, Safety, Vendor |
| type         | VARCHAR(100) | Internal, External, Vendor |
| division     | VARCHAR(100) | Compressor, Filters, Pumps, Glass, Water Heater, Electronics, Packaging |
| category     | VARCHAR(100) | Quality A, Quality B, Quality C, Quality D |
| priority     | VARCHAR(50)  | High, Medium, Low    |
| department   | VARCHAR(100) | Strategy, Finance, Quality, Maintenance, Stores, HR |
| location     | VARCHAR(100) | Pune, Delhi, Mumbai, Chennai, Bangalore |
| status       | VARCHAR(100) | Registered, Running, Closed, Cancelled |


### users_12

| Column             | Type         | Notes                |
|--------------------|--------------|----------------------|
| id                 | INT          | Primary key, auto-increment |
| email              | VARCHAR(255) | Unique, not null     |
| password           | VARCHAR(255) | SHA-256 hashed, not null |
| reset_token        | VARCHAR(100) | Used for forgot-password flow |
| reset_token_expiry | DATETIME     | Token expiration time |


### migration_history

| Column         | Type         | Notes                |
|----------------|--------------|----------------------|
| id             | INT          | Primary key, auto-increment |
| migration_name | VARCHAR(255) | Unique, not null     |
| applied_at     | TIMESTAMP    | Defaults to current time |

This table is created automatically by migrate.py to track which migrations have been applied.


## Sample Data

- 40 projects are seeded via Python (database.py) using randomized data
- 2 users are seeded via migration 004:
  - alice@projects.com / Alice@123
  - bob@projects.com / Bob@456
