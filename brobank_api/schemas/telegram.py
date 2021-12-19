from marshmallow import Schema, fields


class TelegramCallbackSchema(Schema):
    id = fields.Integer(required=True)
    first_name = fields.String()
    last_name = fields.String()
    username = fields.String()
    photo_url = fields.Url()
    auth_date = fields.Integer()
    hash = fields.String(required=True)
