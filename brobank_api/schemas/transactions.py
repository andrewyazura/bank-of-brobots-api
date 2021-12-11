from brobank_api import marshmallow as ma
from brobank_api.models import Transaction
from brobank_api.statuses import TransactionStatus
from marshmallow import Schema, fields
from marshmallow_enum import EnumField


class PayRequestSchema(Schema):
    amount = fields.Float()
    from_account_id = fields.UUID()
    to_account_id = fields.UUID()


class TransactionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Transaction

    id = ma.auto_field()

    amount = ma.auto_field()
    status = EnumField(TransactionStatus)

    from_account = ma.auto_field()
    to_account = ma.auto_field()

    created_on = ma.auto_field()
    confirmed_on = ma.auto_field()


class TransactionsSchema(Schema):
    transactions = fields.List(fields.Nested(TransactionSchema))
