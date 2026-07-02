from flask import Blueprint, request, jsonify
from database import get_connection
from datetime import datetime

create_bp = Blueprint("create", __name__)

VALID_PRIORITIES = ["High", "Medium", "Low"]
VALID_STATUSES = ["Running", "Registered", "Cancelled", "Closed"]


@create_bp.route("/projects", methods=["POST"])
def add_project():
    conn = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Invalid or missing JSON body."}), 400

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
            try:
                if datetime.strptime(end_date, "%Y-%m-%d") < datetime.strptime(start_date, "%Y-%m-%d"):
                    return jsonify({"message": "End date cannot be before start date."}), 400
            except ValueError:
                return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400

        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects WHERE project_name = %s", (data["project_name"],))
        if cursor.fetchone():
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
        return jsonify({"message": "Project added successfully!"}), 201

    except Exception as e:
        print("=" * 60)
        print("CREATE PROJECT ERROR:", str(e))
        print("=" * 60)
        return jsonify({"error": "Something went wrong. Please try again later."}), 500
    finally:
        if conn:
            conn.close()
