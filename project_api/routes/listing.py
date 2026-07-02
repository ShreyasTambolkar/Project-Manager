from flask import Blueprint, request, jsonify
from database import get_connection, row_to_dict

listing_bp = Blueprint("listing", __name__)

VALID_PRIORITIES = ["High", "Medium", "Low"]
VALID_STATUSES = ["Running", "Registered", "Cancelled", "Closed"]


@listing_bp.route("/projects", methods=["GET"])
def get_all_projects():
    conn = None
    try:
        search = request.args.get("q")
        conn = get_connection()
        cursor = conn.cursor()
        if search:
            cursor.execute("SELECT * FROM projects WHERE project_name LIKE %s", (f"%{search}%",))
        else:
            cursor.execute("SELECT * FROM projects")
        rows = cursor.fetchall()
        projects = [row_to_dict(cursor, row) for row in rows]
        if not projects:
            return jsonify({"message": "No projects found!"}), 404
        return jsonify(projects)
    except Exception as e:
        print("=" * 60)
        print("GET ALL PROJECTS ERROR:", str(e))
        print("=" * 60)
        return jsonify({"error": "Something went wrong. Please try again later."}), 500
    finally:
        if conn:
            conn.close()


@listing_bp.route("/projects/sorted", methods=["GET"])
def get_projects_sorted():
    conn = None
    try:
        sort_by = request.args.get("sort", "priority").lower()

        conn = get_connection()
        cursor = conn.cursor()

        if sort_by == "status":
            cursor.execute('''
                SELECT * FROM projects
                ORDER BY CASE status
                    WHEN 'Running' THEN 1
                    WHEN 'Registered' THEN 2
                    WHEN 'Closed' THEN 3
                    WHEN 'Cancelled' THEN 4
                    ELSE 5
                END ASC
            ''')
        elif sort_by == "name":
            cursor.execute("SELECT * FROM projects ORDER BY project_name ASC")
        else:
            # Default: priority
            cursor.execute('''
                SELECT * FROM projects
                ORDER BY CASE priority
                    WHEN 'High' THEN 1
                    WHEN 'Medium' THEN 2
                    WHEN 'Low' THEN 3
                    ELSE 4
                END ASC
            ''')

        rows = cursor.fetchall()
        projects = [row_to_dict(cursor, row) for row in rows]
        if not projects:
            return jsonify({"message": "No projects found!"}), 404
        return jsonify(projects)
    except Exception as e:
        print("=" * 60)
        print("GET SORTED PROJECTS ERROR:", str(e))
        print("=" * 60)
        return jsonify({"error": "Something went wrong. Please try again later."}), 500
    finally:
        if conn:
            conn.close()




def set_status(id, new_status):
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM projects WHERE project_id = %s", (id,))
        if not cursor.fetchone():
            return jsonify({"message": f"Project with ID {id} does not exist!"}), 404
        cursor.execute("UPDATE projects SET status = %s WHERE project_id = %s", (new_status, id))
        conn.commit()
        return jsonify({"message": f"Project with ID {id} status set to {new_status}!"})
    except Exception as e:
        print("=" * 60)
        print(f"SET STATUS ERROR (ID={id}):", str(e))
        print("=" * 60)
        return jsonify({"error": "Something went wrong. Please try again later."}), 500
    finally:
        if conn:
            conn.close()


@listing_bp.route("/projects/<int:id>/start", methods=["POST"])
def start_project(id):
    return set_status(id, "Running")


@listing_bp.route("/projects/<int:id>/close", methods=["POST"])
def close_project(id):
    return set_status(id, "Closed")


@listing_bp.route("/projects/<int:id>/cancel", methods=["POST"])
def cancel_project(id):
    return set_status(id, "Cancelled")
