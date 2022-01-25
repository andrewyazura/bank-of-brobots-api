from marshmallow import fields

from brobank_api import marshmallow as ma
from brobank_api.models import ExternalApplication


class ApplicationRequestSchema(ma.SQLAlchemySchema):
    class Meta:
        model = ExternalApplication

    name = ma.auto_field(required=True)
    email = fields.Email(required=True)
    public_name = ma.auto_field()
    description = ma.auto_field()
    callback_url = fields.Url(schemes=("http", "https"))
    ip_whitelist = fields.List(fields.IPv4())


class ApplicationSchema(ma.SQLAlchemySchema):
    class Meta:
        model = ExternalApplication

    public_name = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    email = ma.auto_field()
    callback_url = ma.auto_field()
    ip_whitelist = ma.auto_field()
