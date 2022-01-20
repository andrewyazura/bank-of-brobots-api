from flask import Blueprint
from flask_login import current_user, login_required

from brobank_api import db
from brobank_api.models import Account, ExternalApplication
from brobank_api.schemas.accounts import AccountSchema, AccountsSchema
from brobank_api.schemas.external_applications import (
    ApplicationRequestSchema,
    ApplicationSchema,
)
from brobank_api.validators import validate_request, validate_response

applications_bp = Blueprint("applications", __name__, url_prefix="/applications")


@applications_bp.route("", methods=["GET"])
@login_required
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
@validate_request(ApplicationRequestSchema, exclude=("name", "email"))
@validate_response(ApplicationSchema)
def update_application(request_data):
    for key, value in request_data.items():
        setattr(current_user, key, value)
    db.session.commit()

    return current_user


@applications_bp.route("", methods=["DELETE"])
@login_required
@validate_response(ApplicationSchema)
def delete_application():
    current_user.mark_deleted()
    db.session.commit()

    return current_user


@applications_bp.route("/accounts", methods=["GET"])
@login_required
@validate_request(AccountSchema)
@validate_response(AccountsSchema)
def get_accounts(request_data):
    return {
        "accounts": Account.query.filter_by(
            application_id=current_user.id, **request_data
        )
    }


@applications_bp.route("/accounts", methods=["POST"])
@login_required
@validate_response(AccountSchema)
def create_account():
    account = Account(application=current_user)

    db.session.add(account)
    db.session.commit()

    return account


@applications_bp.route("/accounts", methods=["DELETE"])
@login_required
@validate_request(AccountSchema)
@validate_response(AccountSchema)
def delete_account(request_data):
    account = Account.query.filter_by(
        application=current_user.id, **request_data
    ).first()

    db.session.delete(account)
    db.session.commit()

    return account


@applications_bp.route("/token", methods=["DELETE"])
@login_required
def revoke_application_token():
    token = current_user.update_token()
    db.session.commit()

    return {"token": token}
