from brobank_api import login_manager
from brobank_api.enums import ExternalApplicationStatus
from brobank_api.exceptions import APIException
from brobank_api.models import ExternalApplication


@login_manager.request_loader
def load_application_from_request(request):
    token = request.headers.get("Authorization")

    if not token:
        return None

    token = token.replace("Bearer ", "", 1)
    application = ExternalApplication.get_by_token(token)

    if not application or application.status == ExternalApplicationStatus.Deleted:
        raise APIException(400, "Bearer token is invalid.")

    if application.status == ExternalApplicationStatus.Restricted:
        raise APIException(403, "Application is restricted.")

    if not application.verify_ip(request.remote_addr):
        raise APIException(403, "IP is not allowed.")

    return application


@login_manager.unauthorized_handler
def unauthorized():
    return {"error": "Request is unauthorized."}, 401
