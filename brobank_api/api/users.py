from flask import Blueprint
from flask_login import login_required

from brobank_api import db
from brobank_api.enums import Permissions
from brobank_api.exceptions import InvalidRequestParameter
from brobank_api.models import Account, User
from brobank_api.schemas.accounts import (
    AccountSchema,
    AccountsSchema,
    UserAccountSchema,
)
from brobank_api.schemas.users import UserSchema, UsersSchema
from brobank_api.validators import (
    validate_permission,
    validate_request,
    validate_response,
)

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("", methods=["GET"])
@login_required
@validate_permission(Permissions.Users)
@validate_request(UserSchema)
@validate_response(UsersSchema)
def get_users(request_data):
    return {"users": User.query.filter_by(**request_data)}


@users_bp.route("/accounts", methods=["GET"])
@login_required
@validate_permission(Permissions.Users)
@validate_request(UserAccountSchema)
@validate_response(AccountsSchema)
def get_accounts(request_data):
    return {"accounts": Account.query.filter_by(**request_data)}


@users_bp.route("/accounts", methods=["POST"])
@login_required
@validate_permission(Permissions.Users)
@validate_request(UserAccountSchema, only=("user_id",))
@validate_response(AccountSchema)
def create_account(request_data):
    account = Account(user_id=request_data["user_id"])

    db.session.add(account)
    db.session.commit()

    return account


@users_bp.route("/accounts", methods=["DELETE"])
@login_required
@validate_permission(Permissions.Users)
@validate_request(UserAccountSchema)
@validate_response(AccountSchema)
def delete_account(request_data):
    account = Account.query.filter_by(**request_data).first()

    if not account:
        raise InvalidRequestParameter("id")

    db.session.delete(account)
    db.session.commit()

    return account
