from flask import Blueprint
from flask_login import current_user, login_required

from brobank_api import db
from brobank_api.enums import EndpointPermissions, ExternalApplicationStatus
from brobank_api.models import ExternalApplication
from brobank_api.schemas.external_applications import (
    ApplicationRequestSchema,
    ApplicationSchema,
)
from brobank_api.validators import validate_permission, validate_request

applications_bp = Blueprint("applications", __name__, url_prefix="/applications")


@applications_bp.route("", methods=["GET"])
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
def get_application():
    return ApplicationSchema().dump(current_user)


@applications_bp.route("", methods=["POST"])
@validate_request(ApplicationRequestSchema)
def create_application(request_data):
    application = ExternalApplication(**request_data)
    token = application.update_token()
    db.session.add(application)
    db.session.commit()

    return {"token": token}


@applications_bp.route("", methods=["PUT"])
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
@validate_request(ApplicationRequestSchema, exclude=("name", "email"))
def update_application(request_data):
    for key, value in request_data.items():
        setattr(current_user, key, value)
    db.session.commit()

    return ApplicationSchema().dump(current_user)


@applications_bp.route("", methods=["DELETE"])
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
def delete_application():
    current_user.status = ExternalApplicationStatus.Deleted
    db.session.commit()

    return ApplicationSchema().dump(current_user)


@applications_bp.route("/token", methods=["DELETE"])
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
def revoke_application_token():
    token = current_user.update_token()
    db.session.commit()

    return {"token": token}
