from marshmallow import Schema, fields
from marshmallow_enum import EnumField

from brobank_api import marshmallow as ma
from brobank_api.enums import UserStatus
from brobank_api.models import User


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    status = EnumField(UserStatus)

    telegram_id = ma.auto_field()
    first_name = ma.auto_field()
    last_name = ma.auto_field()
    username = ma.auto_field()
    photo_url = ma.auto_field()

    created_on = ma.auto_field()


class UsersSchema(Schema):
    users = fields.List(fields.Nested(UserSchema))
