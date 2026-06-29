from flask import Blueprint, jsonify
from database import get_connection

charts_bp = Blueprint("charts", __name__)


@charts_bp.route("/projects/chart/dept-stats", methods=["GET"])
def dept_stats():
    conn   = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            department,
            COUNT(*)                                      AS total,
            SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closed
        FROM projects
        GROUP BY department
        ORDER BY department
    """)
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([
        { "department": row[0], "total": row[1], "closed": row[2] }
        for row in rows
    ])
