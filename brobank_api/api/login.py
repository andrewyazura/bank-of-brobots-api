from brobank_api import login_manager
from brobank_api.enums import ExternalApplicationStatus
from brobank_api.exceptions import (
    ExternalApplicationForbiddenIP,
    ExternalApplicationRestricted,
    InvalidExternalApplicationToken,
)
from brobank_api.models import ExternalApplication


@login_manager.request_loader
def load_application_from_request(request):
    token = request.headers.get("Authorization")

    if not token:
        return None

    token = token.replace("Bearer ", "", 1)
    application = ExternalApplication.get_by_token(token)

    if not application or application.status == ExternalApplicationStatus.Deleted:
        raise InvalidExternalApplicationToken()

    if application.status == ExternalApplicationStatus.Restricted:
        raise ExternalApplicationRestricted()

    if not application.verify_ip(request.remote_addr):
        raise ExternalApplicationForbiddenIP()

    return application


@login_manager.unauthorized_handler
def unauthorized():
    return {"error": "Request is unauthorized."}, 401
