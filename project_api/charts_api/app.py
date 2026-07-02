from dotenv import load_dotenv
load_dotenv()

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from flask import Flask
from flask_cors import CORS
from config import Config
from database import init_db
from routes.charts import charts_bp

app = Flask(__name__)
from logger_setup import setup_logging
setup_logging(app)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(charts_bp)

if __name__ == "__main__":
    init_db()
    app.run(host=Config.HOST, port=Config.CHARTS_PORT)
