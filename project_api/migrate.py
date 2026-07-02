"""
Migration Runner
─────────────────
Runs all .sql files in the migrations/ folder in order.
Tracks which migrations have already been applied in a
`migration_history` table so they are never run twice.

Usage:
    python migrate.py          # Apply all pending migrations
    python migrate.py --status # Show migration status
"""

import os
import sys
import glob
import argparse

import mysql.connector
from config import Config


def get_connection():
    return mysql.connector.connect(
        host     = Config.DB_HOST,
        database = Config.DB_NAME,
        user     = Config.DB_USER,
        password = Config.DB_PASSWORD,
        port     = Config.DB_PORT,
    )


def ensure_history_table(cursor):
    """Create the migration tracking table if it doesn't exist."""
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS migration_history (
            id             INT AUTO_INCREMENT PRIMARY KEY,
            migration_name VARCHAR(255) UNIQUE NOT NULL,
            applied_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')


def get_applied_migrations(cursor):
    """Return a set of migration filenames that have already been applied."""
    cursor.execute("SELECT migration_name FROM migration_history ORDER BY id")
    return {row[0] for row in cursor.fetchall()}


def get_pending_migrations(cursor, migrations_dir):
    """Return a sorted list of .sql files that haven't been applied yet."""
    applied = get_applied_migrations(cursor)
    all_files = sorted(glob.glob(os.path.join(migrations_dir, "*.sql")))
    pending = []
    for filepath in all_files:
        name = os.path.basename(filepath)
        if name not in applied:
            pending.append((name, filepath))
    return pending


def run_migration(cursor, name, filepath):
    """Execute a single .sql migration file."""
    with open(filepath, "r", encoding="utf-8") as f:
        sql = f.read()

    # Split on semicolons to handle multi-statement files
    statements = [s.strip() for s in sql.split(";") if s.strip()]
    for statement in statements:
        # Skip comments-only blocks
        upper = statement.upper()
        if upper.startswith("DELIMITER"):
            continue
        try:
            cursor.execute(statement)
        except mysql.connector.Error as err:
            # 1060 = Duplicate column (already exists) — safe to skip
            # 1050 = Table already exists — safe to skip
            if err.errno in (1060, 1050):
                continue
            raise

    # Record the migration as applied
    cursor.execute(
        "INSERT INTO migration_history (migration_name) VALUES (%s)",
        (name,)
    )


def show_status(cursor, migrations_dir):
    """Print which migrations are applied and which are pending."""
    applied = get_applied_migrations(cursor)
    all_files = sorted(glob.glob(os.path.join(migrations_dir, "*.sql")))

    print("\n  Migration Status")
    print("  " + "-" * 50)
    for filepath in all_files:
        name = os.path.basename(filepath)
        mark = "[OK]      Applied" if name in applied else "[PENDING] Pending"
        print(f"  {mark}  |  {name}")
    print("  " + "-" * 50)
    print()


def main():
    parser = argparse.ArgumentParser(description="Database migration runner")
    parser.add_argument("--status", action="store_true", help="Show migration status")
    args = parser.parse_args()

    migrations_dir = os.path.join(os.path.dirname(__file__), "migrations")

    if not os.path.isdir(migrations_dir):
        print("  [ERROR] migrations/ directory not found.")
        sys.exit(1)

    conn   = get_connection()
    cursor = conn.cursor()
    ensure_history_table(cursor)
    conn.commit()

    if args.status:
        show_status(cursor, migrations_dir)
        cursor.close()
        conn.close()
        return

    pending = get_pending_migrations(cursor, migrations_dir)

    if not pending:
        print("\n  [OK] All migrations are already applied. Nothing to do.\n")
        cursor.close()
        conn.close()
        return

    print(f"\n  Applying {len(pending)} pending migration(s)...\n")

    for name, filepath in pending:
        try:
            run_migration(cursor, name, filepath)
            conn.commit()
            print(f"  [OK] Applied: {name}")
        except mysql.connector.Error as err:
            conn.rollback()
            print(f"  [FAILED] {name} -> {err}")
            sys.exit(1)

    print(f"\n  Done! {len(pending)} migration(s) applied successfully.\n")

    cursor.close()
    conn.close()


if __name__ == "__main__":
    main()
