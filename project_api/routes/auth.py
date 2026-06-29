import os
import re
import secrets
from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify
from mail import mail  
from flask_mail import Message
  

from database import get_connection, hash_password, row_to_dict
from config import Config

auth_bp = Blueprint("auth", __name__)


# ─── Login ────────────────────────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email    = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    conn   = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users_12 WHERE email = %s", (email,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Email not found."}), 401

    user = row_to_dict(cursor, row)
    if user["password"] != hash_password(password):
        return jsonify({"error": "Incorrect password."}), 401

    return jsonify({
        "message": "Login successful.",
        "user": {"id": user["id"], "email": user["email"]}
    }), 200


# ─── Forgot Password ──────────────────────────────────────────────────────────
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data  = request.get_json()
    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Email is required."}), 400

    try:
        conn   = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users_12 WHERE email = %s", (email,))
        row = cursor.fetchone()

        # Don't reveal whether email exists
        if not row:
            conn.close()
            return jsonify({"message": "If that email is registered, a reset link has been sent."}), 200

        # Generate token valid for 1 hour
        token  = secrets.token_urlsafe(32)
        expiry = datetime.utcnow() + timedelta(hours=1)

        cursor.execute(
            "UPDATE users_12 SET reset_token = %s, reset_token_expiry = %s WHERE email = %s",
            (token, expiry, email)
        )
        conn.commit()
        conn.close()

        # Build reset link
        frontend_url = Config.FRONTEND_URL
        reset_link   = f"{frontend_url}/reset-password/{token}"

        # Send email
        msg  = Message(
            subject    = "Password Reset Request",
            recipients = [email],
            html       = f"""
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
              <h2 style="color:#1e3a5f;margin-bottom:8px">Password Reset</h2>
              <p style="color:#444">You requested a password reset for your account.</p>
              <p style="color:#444">Click the button below to set a new password:</p>
              <a href="{reset_link}"
                 style="display:inline-block;background:#1e3a8a;color:white;
                        padding:12px 28px;border-radius:24px;text-decoration:none;
                        font-weight:600;font-size:15px;margin:16px 0">
                Reset My Password
              </a>
              <p style="color:#888;font-size:13px;margin-top:20px">
                This link expires in <strong>1 hour</strong>.<br>
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            """
        )
        mail.send(msg)

        return jsonify({"message": "If that email is registered, a reset link has been sent."}), 200

    except Exception as e:
        print("=" * 60)
        print("FORGOT PASSWORD ERROR:", str(e))
        print("=" * 60)
        return jsonify({"error": f"Server error: {str(e)}"}), 500



# ─── Reset Password ──────────────────────────────────────────────────────────
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data     = request.get_json()
    token    = data.get("token", "").strip()
    password = data.get("password", "").strip()

    if not token or not password:
        return jsonify({"error": "Token and new password are required."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    try:
        conn   = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT * FROM users_12 WHERE reset_token = %s",
            (token,)
        )
        row = cursor.fetchone()

        if not row:
            conn.close()
            return jsonify({"error": "Invalid or expired reset link."}), 400

        user = row_to_dict(cursor, row)

        # Check token expiry
        if user["reset_token_expiry"] and datetime.utcnow() > user["reset_token_expiry"]:
            # Clear expired token
            cursor.execute(
                "UPDATE users_12 SET reset_token = NULL, reset_token_expiry = NULL WHERE id = %s",
                (user["id"],)
            )
            conn.commit()
            conn.close()
            return jsonify({"error": "Reset link has expired. Please request a new one."}), 400

        # Update password and clear token
        cursor.execute(
            "UPDATE users_12 SET password = %s, reset_token = NULL, reset_token_expiry = NULL WHERE id = %s",
            (hash_password(password), user["id"])
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Password reset successfully! You can now log in."}), 200

    except Exception as e:
        print("=" * 60)
        print("RESET PASSWORD ERROR:", str(e))
        print("=" * 60)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

