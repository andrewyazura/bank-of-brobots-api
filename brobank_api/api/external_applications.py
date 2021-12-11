from brobank_api import db, login_manager
from brobank_api.api import api_bp
from brobank_api.enums import EndpointPermissions, ExternalApplicationStatus
from brobank_api.exceptions import (
    ExternalApplicationForbiddenIP,
    ExternalApplicationRestricted,
    InvalidExternalApplicationToken,
)
from brobank_api.models import ExternalApplication
from brobank_api.schemas.external_applications import (
    ApplicationRequestSchema,
    ApplicationSchema,
)
from brobank_api.validators import validate_permission, validate_request
from flask_login import current_user, login_required


@login_manager.request_loader
def load_application_from_request(request):
    token = request.headers.get("Authorization")

    if not token:
        return None

    token = token.replace("Bearer ", "", 1)
    application = ExternalApplication.get_by_token(token)

    if not application or application.status == ExternalApplicationStatus.Deleted:
        raise InvalidExternalApplicationToken("Bearer token is invalid.")

    if application.status == ExternalApplicationStatus.Restricted:
        raise ExternalApplicationRestricted("Application is restricted.")

    if not application.verify_ip(request.remote_addr):
        raise ExternalApplicationForbiddenIP(f"IP is not allowed.")

    return application


@login_manager.unauthorized_handler
def unauthorized():
    return {"error": "Request is unauthorized."}, 401


@api_bp.route("/applications", methods=["GET"])
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
def application():
    return ApplicationSchema().dump(current_user)


@api_bp.route("/applications", methods=["POST"])
@validate_request(ApplicationRequestSchema)
def application_create(request_data):
    application = ExternalApplication(**request_data)
    token = application.update_token()
    db.session.add(application)
    db.session.commit()

    return {"token": token}


@api_bp.route("/applications", methods=["PUT"])
@validate_request(ApplicationRequestSchema, exclude=("name", "email"))
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
def application_update(request_data):
    for key, value in request_data.items():
        setattr(current_user, key, value)
    db.session.commit()

    return ApplicationSchema().dump(current_user)


@api_bp.route("/applications", methods=["DELETE"])
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
def application_delete():
    current_user.status = ExternalApplicationStatus.Deleted
    db.session.commit()

    return ApplicationSchema().dump(current_user)


@api_bp.route("/applications/token", methods=["DELETE"])
@login_required
@validate_permission(EndpointPermissions.ExternalApplications)
def application_token_revoke():
    token = current_user.update_token()
    db.session.commit()

    return {"token": token}
