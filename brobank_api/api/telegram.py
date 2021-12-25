import hmac
from hashlib import sha256

from flask import Blueprint, current_app, redirect

from brobank_api import db
from brobank_api.exceptions import InvalidTelegramCallbackHash
from brobank_api.models import User
from brobank_api.schemas.telegram import TelegramCallbackSchema
from brobank_api.validators import validate_request

telegram_bp = Blueprint("telegram", __name__, url_prefix="/telegram")


@telegram_bp.route("/callback", methods=["GET"])
@validate_request(TelegramCallbackSchema)
def telegram_callback(request_data):
    bot_config = current_app.config.get("TELEGRAM_BOT")
    received_hash = request_data.pop("hash", None)

    secret_key = sha256(bot_config.get("TOKEN").encode()).digest()
    data_check_string = "\n".join(
        f"{key}={request_data[key]}" for key in sorted(request_data.keys())
    )
    actual_hash = hmac.new(secret_key, data_check_string.encode(), sha256).hexdigest()

    if actual_hash != received_hash:
        raise InvalidTelegramCallbackHash()

    request_data.pop("auth_date", None)

    user = User(**request_data)
    db.session.add(user)
    db.session.commit()

    return redirect(bot_config.get("REDIRECT_URL")), 302
