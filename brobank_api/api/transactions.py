from brobank_api.api import api_bp
from brobank_api.permissions import EndpointPermissions
from brobank_api.validators import validate_permission
from flask_login import current_user, login_required


@api_bp.route("/pay", methods=["POST"])
@login_required
@validate_permission(EndpointPermissions.Transactions)
def pay():
    pass


@api_bp.route("/status", methods=["GET"])
@login_required
@validate_permission(EndpointPermissions.Transactions)
def status():
    pass
