from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime

create_bp = Blueprint("create", __name__)

VALID_PRIORITIES = ["High", "Medium", "Low"]
VALID_STATUSES = ["Running", "Registered", "Cancelled", "Closed"]


@create_bp.route("/projects", methods=["POST"])
def add_project():
    data = request.get_json()
    required_fields = ["project_name"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    priority = data.get("priority", "Medium")
    if priority not in VALID_PRIORITIES:
        return jsonify({"message": f"Priority must be one of {VALID_PRIORITIES}"}), 400

    status = data.get("status", "Registered")
    if status not in VALID_STATUSES:
        return jsonify({"message": f"Status must be one of {VALID_STATUSES}"}), 400

    start_date = data.get("start_date")
    end_date   = data.get("end_date")

    if start_date and end_date:
        if datetime.strptime(end_date, "%Y-%m-%d") < datetime.strptime(start_date, "%Y-%m-%d"):
            return jsonify({"message": "End date cannot be before start date."}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects WHERE project_name = %s", (data["project_name"],))
    if cursor.fetchone():
        conn.close()
        return jsonify({"message": "This project already exists!"}), 409

    cursor.execute('''
        INSERT INTO projects
            (project_name, start_date, end_date, reason, type, division,
             category, priority, department, location, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (
        data["project_name"], data.get("start_date"), data.get("end_date"),
        data.get("reason"), data.get("type"), data.get("division"),
        data.get("category"), priority, data.get("department"),
        data.get("location"), status
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Project added successfully!"}), 201
