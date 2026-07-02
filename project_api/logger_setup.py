import logging
import traceback
from flask import request

def setup_logging(app):
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(name)s - %(message)s'
    )
    logger = logging.getLogger(app.name)

    @app.before_request
    def log_request_info():
        logger.info(f"Started {request.method} {request.url}")

    @app.after_request
    def log_response_info(response):
        logger.info(f"Completed {request.method} {request.path} - Status: {response.status_code}")
        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled Exception: {e}\n{traceback.format_exc()}")
        from werkzeug.exceptions import HTTPException
        if isinstance(e, HTTPException):
            return e
        return {"error": "Internal Server Error", "message": str(e)}, 500
