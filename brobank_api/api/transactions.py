import requests
from flask import Blueprint, after_this_request, current_app
from flask_login import current_user, login_required
from requests.exceptions import RequestException

from brobank_api import db
from brobank_api.enums import Permissions, TransactionStatus
from brobank_api.exceptions import APIException, InvalidRequestParameter
from brobank_api.models import Account, Transaction
from brobank_api.schemas.transactions import (
    PayRequestSchema,
    TransactionSchema,
    TransactionsSchema,
    UpdateTransactionRequestSchema,
)
from brobank_api.validators import (
    validate_permission,
    validate_request,
    validate_response,
)

transactions_bp = Blueprint("transactions", __name__, url_prefix="/transactions")


@transactions_bp.route("", methods=["GET"])
@login_required
@validate_permission(Permissions.Transactions)
@validate_request(TransactionSchema)
@validate_response(TransactionsSchema)
def get_transactions(request_data):
    return {
        "transactions": Transaction.query.filter_by(
            application_id=current_user.id, **request_data
        )
    }


@transactions_bp.route("", methods=["POST"])
@login_required
@validate_permission(Permissions.Transactions)
@validate_request(PayRequestSchema)
@validate_response(TransactionSchema, exclude=("confirmed_on",))
def pay(request_data):
    amount = request_data["amount"]
    from_account = Account.query.get(request_data["from_account_id"])
    to_account = Account.query.get(request_data["to_account_id"])

    if not from_account:
        raise InvalidRequestParameter("from_account_id")

    if not to_account:
        raise InvalidRequestParameter("to_account_id")

    if from_account.id == to_account.id:
        raise APIException(400, "You can't send money to the same account")

    if (
        not current_user.has_permission(Permissions.UserToUserTransactions)
        and from_account.application_id != current_user.id
        and to_account.application_id != current_user.id
    ):
        raise APIException(
            403,
            "This application is not allowed to "
            "execute direct user-to-user transactions",
        )

    if amount <= 0:
        raise InvalidRequestParameter("amount")

    if from_account.money < amount:
        raise APIException(
            400, "Sender account has not enough money for the transaction."
        )

    transaction = Transaction(
        amount=amount,
        from_account=from_account,
        to_account=to_account,
        application=current_user,
    )
    db.session.add(transaction)
    db.session.commit()

    return transaction


@transactions_bp.route("", methods=["PUT"])
@login_required
@validate_permission(Permissions.UpdateTransactionStatus)
@validate_request(UpdateTransactionRequestSchema)
@validate_response(TransactionSchema)
def update_transaction_status(request_data):
    status = request_data["status"]
    transaction = Transaction.query.with_for_update().get(
        request_data["transaction_id"]
    )

    if not transaction:
        raise InvalidRequestParameter("transaction_id")

    if transaction.status in (TransactionStatus.Done, TransactionStatus.Rejected):
        return transaction

    if status not in (TransactionStatus.Done, TransactionStatus.Rejected):
        raise InvalidRequestParameter("status")

    if transaction.from_account.money < transaction.amount:
        raise APIException(
            400, "Sender account has not enough money for the transaction."
        )

    transaction.from_account.money -= transaction.amount
    transaction.to_account.money += transaction.amount
    transaction.update_status(status)

    db.session.commit()

    if callback_url := transaction.application.callback_url:
        # deferred request callback
        @after_this_request
        def send_callback(response):
            try:
                requests.post(
                    url=callback_url,
                    data=TransactionSchema().dump(transaction),
                    headers=current_app.config["CALLBACK"]["HEADERS"],
                    timeout=current_app.config["CALLBACK"]["TIMEOUT"],
                )
            except RequestException as exception:
                current_app.logger.warning(exception)
            finally:
                return response

    return transaction
