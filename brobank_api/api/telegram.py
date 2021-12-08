import hmac
from hashlib import sha256

from brobank_api import db
from brobank_api.api import api_bp
from brobank_api.exceptions import InvalidTelegramCallbackHash
from brobank_api.models import User
from brobank_api.schemas.telegram import TelegramCallbackSchema
from brobank_api.validators import validate_request
from flask import current_app, redirect


@api_bp.route("/telegram_callback", methods=["GET"])
@validate_request(TelegramCallbackSchema)
def telegram_callback(request_data):
    if not request_data:
        pass

    received_hash = request_data.pop("hash", None)

    secret_key = sha256(current_app.config["TELEGRAM_BOT_TOKEN"].encode()).hexdigest()
    data_check_string = "\n".join(
        f"{key}={request_data[key]}" for key in sorted(request_data.keys())
    )
    actual_hash = hmac.new(secret_key, data_check_string.encode(), sha256).hexdigest()

    if actual_hash != received_hash:
        raise InvalidTelegramCallbackHash("Invalid callback hash.")

    user = User(**request_data)
    db.session.add(user)
    db.session.commit()

    return redirect(current_app.config["TELEGRAM_BOT_URL"]), 302
