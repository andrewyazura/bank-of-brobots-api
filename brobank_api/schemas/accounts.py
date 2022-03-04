from marshmallow import Schema, fields

from brobank_api import marshmallow as ma
from brobank_api.models import Account


class AccountSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Account

    id = ma.auto_field()
    money = ma.auto_field()


class UserAccountSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Account

    id = ma.auto_field()
    money = ma.auto_field()

    user_id = ma.auto_field(required=True)


class AccountsSchema(Schema):
    accounts = fields.List(fields.Nested(AccountSchema))
