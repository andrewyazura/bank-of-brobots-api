from flask import Blueprint
from flask_login import current_user, login_required

from brobank_api import db
from brobank_api.enums import EndpointPermissions
from brobank_api.exceptions import AccountHasNotEnoughMoney
from brobank_api.models import Account, Transaction
from brobank_api.schemas.transactions import (
    PayRequestSchema,
    TransactionSchema,
    TransactionsSchema,
)
from brobank_api.validators import validate_permission, validate_request

transactions_bp = Blueprint("transactions", __name__, url_prefix="/transactions")


@transactions_bp.route("", methods=["GET"])
@login_required
@validate_permission(EndpointPermissions.Transactions)
@validate_request(TransactionSchema)
def get_transactions(request_data):
    transactions = Transaction.query.filter_by(
        application=current_user.id, **request_data
    )
    return TransactionsSchema().dump({"transactions": transactions})


@transactions_bp.route("/pay", methods=["POST"])
@login_required
@validate_permission(EndpointPermissions.Transactions)
@validate_request(PayRequestSchema)
def pay(request_data):
    amount = request_data["amount"]
    from_account = Account.query.get(request_data["from_account_id"])
    to_account = Account.query.get(request_data["to_account_id"])

    if from_account.money < amount:
        raise AccountHasNotEnoughMoney()

    transaction = Transaction(
        amount=amount,
        from_account=from_account.id,
        to_account=to_account.id,
        application=current_user.id,
    )
    db.session.add(transaction)
    db.session.commit()

    return TransactionSchema().dump(transaction)
