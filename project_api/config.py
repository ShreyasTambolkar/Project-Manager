import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ─── Database ───
    DB_HOST     = os.environ.get("DB_HOST")
    DB_NAME     = os.environ.get("DB_NAME")
    DB_USER     = os.environ.get("DB_USER")
    DB_PASSWORD = os.environ.get("DB_PASSWORD")
    DB_PORT     = int(os.environ.get("DB_PORT"))

    # ─── Microservice Ports ───
    AUTH_PORT    = int(os.environ.get("AUTH_PORT"))
    STATS_PORT   = int(os.environ.get("STATS_PORT"))
    CHARTS_PORT  = int(os.environ.get("CHARTS_PORT"))
    LISTING_PORT = int(os.environ.get("LISTING_PORT"))
    CREATE_PORT  = int(os.environ.get("CREATE_PORT"))

    # ─── Frontend ───
    FRONTEND_URL = os.environ.get("FRONTEND_URL")

    # ─── Server Host ───
    HOST         = os.environ.get("HOST", "0.0.0.0")

    # ─── Mail Config ───
    MAIL_SERVER  = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT    = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True").lower() in ["true", "1", "yes"]