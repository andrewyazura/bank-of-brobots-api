import re

from flask import Blueprint, abort
from marshmallow import ValidationError
from psycopg2.errors import UniqueViolation
from sqlalchemy import exc

from brobank_api import db
from brobank_api.exceptions import APIException

errors_bp = Blueprint("errors", __name__)


@errors_bp.app_errorhandler(404)
def not_found_error(error):
    return {"error": "Resource not found."}, 404


@errors_bp.app_errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return {"error": "Internal error."}, 500


@errors_bp.app_errorhandler(APIException)
def custom_exception(error):
    return {"error": error.message}, error.code


@errors_bp.app_errorhandler(ValidationError)
def marshmallow_error(error):
    return {"error": "Validation error.", "errors": error.messages}, 400


@errors_bp.app_errorhandler(exc.OperationalError)
def operational_error(error):
    db.session.rollback()
    return {"error": "Internal error."}, 500


@errors_bp.app_errorhandler(exc.IntegrityError)
def integrity_error(error):
    db.session.rollback()

    if isinstance(error.orig, UniqueViolation):
        field, value = re.findall(r"Key \((.+)\)=\((.+)\)", error.orig.pgerror)[0]
        return {"error": f"{field=} with {value=} is already taken"}, 400

    return {"error": "DB error."}, 400
