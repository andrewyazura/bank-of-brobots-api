from marshmallow import Schema, fields


class TelegramCallbackSchema(Schema):
    id = fields.Integer()
    first_name = fields.String()
    last_name = fields.String()
    username = fields.String()
    photo_url = fields.Url()
    auth_data = fields.DateTime()
    hash = fields.String()
