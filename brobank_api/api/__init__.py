from flask import Blueprint, current_app, request

import brobank_api.api.login
from brobank_api.api.errors import errors_bp
from brobank_api.api.external_applications import applications_bp
from brobank_api.api.telegram import telegram_bp
from brobank_api.api.transactions import transactions_bp

api_bp = Blueprint("api", __name__, url_prefix="/api")

api_bp.register_blueprint(errors_bp)
api_bp.register_blueprint(applications_bp)
api_bp.register_blueprint(telegram_bp)
api_bp.register_blueprint(transactions_bp)


@api_bp.before_request
def log_request_info():
    current_app.logger.info(
        f"{request.remote_addr} - {request.method} - {request.path}"
    )
