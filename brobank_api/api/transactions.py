from brobank_api.api import api_bp
from flask_login import current_user, login_required


@api_bp.route("/pay", methods=["POST"])
@login_required
def pay():
    pass


@api_bp.route("/status", methods=["GET"])
@login_required
def status():
    pass
