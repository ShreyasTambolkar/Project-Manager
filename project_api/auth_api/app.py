from dotenv import load_dotenv
load_dotenv()

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from flask import Flask
from flask_cors import CORS
from config import Config
from database import init_db
from mail import mail
from routes.auth import auth_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Mail config
app.config["MAIL_SERVER"] = Config.MAIL_SERVER
app.config["MAIL_PORT"] = Config.MAIL_PORT
app.config["MAIL_USE_TLS"] = Config.MAIL_USE_TLS
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_USERNAME")

mail.init_app(app)

# Auth API only
app.register_blueprint(auth_bp)

if __name__ == "__main__":
    init_db()
    app.run(host=Config.HOST, port=Config.AUTH_PORT)
