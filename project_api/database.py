import random
from datetime import date, timedelta

import mysql.connector
import hashlib
from config import Config


def get_connection():
    return mysql.connector.connect(
        host     = Config.DB_HOST,
        database = Config.DB_NAME,
        user     = Config.DB_USER,
        password = Config.DB_PASSWORD,
        port     = Config.DB_PORT,
    )


def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def row_to_dict(cursor, row):
    columns = [desc[0] for desc in cursor.description]
    return dict(zip(columns, row))


# ─── Sample data generator ──────────────────────────────────────────────────
random.seed(42)

DEPARTMENTS = [
    ("Strategy",    9, 4),
    ("Finance",      4,  3),
    ("Quality",      9,  8),
    ("Maintenance", 7, 7),
    ("Stores",       5,  2),
    ("HR",           6,  5),
]

REASONS    = ["Business", "Dealership", "Transport", "Compliance", "Safety", "Vendor"]
TYPES      = ["Internal", "External", "Vendor"]
DIVISIONS  = ["Compressor", "Filters", "Pumps", "Glass", "Water Heater", "Electronics", "Packaging"]
CATEGORIES = ["Quality A", "Quality B", "Quality C", "Quality D"]
PRIORITIES = ["High", "Medium", "Low"]
LOCATIONS  = ["Pune", "Delhi", "Mumbai", "Chennai", "Bangalore"]

PROJECT_NOUNS = [
    "Filter", "Connector", "Reflector", "Heater", "Mixer", "Sensor", "Valve",
    "Pump", "Switch", "Panel", "Tracker", "Module", "Gasket", "Bracket",
    "Coupling", "Regulator", "Manifold", "Cooler", "Adapter", "Housing",
]
PROJECT_SUFFIXES = [
    "Upgrade", "Replacement", "Installation", "Audit", "Inspection",
    "Calibration", "Rollout", "Renewal", "Assessment", "Revamp",
]


def _random_date(start_year=2021, end_year=2023):
    start = date(start_year, 1, 1)
    end = date(end_year, 12, 31)
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, delta))


def build_sample_projects():
    rows = []
    for dept, total, closed in DEPARTMENTS:
        statuses = ["Closed"] * closed
        remaining_statuses = ["Running", "Registered", "Cancelled"]
        for i in range(total - closed):
            statuses.append(remaining_statuses[i % len(remaining_statuses)])
        random.shuffle(statuses)

        for i, status in enumerate(statuses):
            noun   = random.choice(PROJECT_NOUNS)
            suffix = random.choice(PROJECT_SUFFIXES)
            name   = f"{noun} {suffix} {i + 1}"

            start = _random_date()
            end   = start + timedelta(days=random.randint(60, 300))

            rows.append((
                name,
                start.isoformat(),
                end.isoformat(),
                random.choice(REASONS),
                random.choice(TYPES),
                random.choice(DIVISIONS),
                random.choice(CATEGORIES),
                random.choice(PRIORITIES),
                dept,
                random.choice(LOCATIONS),
                status,
            ))
    return rows


def init_db():
    conn   = get_connection()
    cursor = conn.cursor()

    # ─── Projects table ───────────────────────────────────────────
    cursor.execute('''
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
        )
    ''')

    cursor.execute("SELECT COUNT(*) FROM projects")
    count = cursor.fetchone()[0]

    if count == 0:
        sample_projects = build_sample_projects()
        cursor.executemany('''
            INSERT INTO projects
                (project_name, start_date, end_date, reason, type, division,
                 category, priority, department, location, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', sample_projects)
        print(f"{len(sample_projects)} sample projects inserted!")

    # ─── Users table ──────────────────────────────────────────────
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users_12 (
            id                  INT AUTO_INCREMENT PRIMARY KEY,
            email               VARCHAR(255) UNIQUE NOT NULL,
            password            VARCHAR(255) NOT NULL,
            reset_token         VARCHAR(100) DEFAULT NULL,
            reset_token_expiry  DATETIME DEFAULT NULL
        )
    ''')

    # ── Add columns if table already existed without them ─────────
    # (safe to run every startup — silently skips if column exists)
    for col, definition in [
        ("reset_token",        "VARCHAR(100) DEFAULT NULL"),
        ("reset_token_expiry", "DATETIME DEFAULT NULL"),
    ]:
        try:
            cursor.execute(f"ALTER TABLE users_12 ADD COLUMN {col} {definition}")
            print(f"Column '{col}' added to users_12.")
        except mysql.connector.Error as err:
            if err.errno == 1060:  # Duplicate column — already exists, ignore
                pass
            else:
                raise

    cursor.execute("SELECT COUNT(*) FROM users_12")
    user_count = cursor.fetchone()[0]

    if user_count == 0:
        sample_users = [
            ("alice@projects.com", hash_password("Alice@123")),
            ("bob@projects.com",   hash_password("Bob@456")),
        ]
        cursor.executemany('''
            INSERT INTO users_12 (email, password)
            VALUES (%s, %s)
        ''', sample_users)
        print("Sample users inserted!")
        print("  alice@projects.com  →  Alice@123")
        print("  bob@projects.com    →  Bob@456")

    conn.commit()
    cursor.close()
    conn.close()
    print("Database is ready!")