import re

from flask import Blueprint, current_app, request
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from werkzeug.exceptions import HTTPException

from brobank_api import db
from brobank_api.exceptions import APIException

errors_bp = Blueprint("errors", __name__)


@errors_bp.app_errorhandler(Exception)
def all_exceptions_handler(error):
    current_app.logger.info(
        f"{request.remote_addr} - {request.method} - {request.path}"
    )
    current_app.logger.error(error)
    return {"error": "Internal Server Error"}, 500


@errors_bp.app_errorhandler(HTTPException)
def http_exception_handler(error):
    db.session.rollback()
    current_app.logger.info(
        f"{request.remote_addr} - {request.method} - {request.path}"
    )
    current_app.logger.error(error)
    return {"error": error.name}, error.code


@errors_bp.app_errorhandler(APIException)
def custom_exception(error):
    current_app.logger.warning(error.message)
    return {"error": error.message}, error.code


@errors_bp.app_errorhandler(ValidationError)
def marshmallow_error(error):
    current_app.logger.warning("Request validation error")
    return {"error": "Validation error.", "errors": error.messages}, 400


@errors_bp.app_errorhandler(IntegrityError)
def unique_violation_error(error):
    db.session.rollback()
    current_app.logger.warning(error)
    field, value = re.findall(r"Key \((.+)\)=\((.+)\)", error.orig.pgerror)[0]
    return {"error": f"{field=} with {value=} is already taken"}, 400


@errors_bp.app_errorhandler(SQLAlchemyError)
def integrity_error(error):
    db.session.rollback()
    current_app.logger.critical(error)
    return {"error": "DB error."}, 500
