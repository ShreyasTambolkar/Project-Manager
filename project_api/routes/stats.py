from flask import Blueprint, jsonify
from database import get_connection

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/projects/stats", methods=["GET"])
def get_project_stats():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM projects")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM projects WHERE status = 'Closed'")
    closed = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM projects WHERE status = 'Running'")
    running = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM projects WHERE status = 'Cancelled'")
    cancelled = cursor.fetchone()[0]

    # Running projects whose end_date has already passed
    cursor.execute("""
        SELECT COUNT(*) FROM projects
        WHERE status = 'Running' AND end_date < CURRENT_DATE
    """)
    closure_delay = cursor.fetchone()[0]

    conn.close()
    return jsonify({
        "total":         total,
        "closed":        closed,
        "running":       running,
        "cancelled":     cancelled,
        "closure_delay": closure_delay,
    })

