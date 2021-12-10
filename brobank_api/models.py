import hmac
from datetime import datetime
from hashlib import sha256
from secrets import token_hex

from flask import current_app
from flask_login import UserMixin
from sqlalchemy.types import ARRAY

from brobank_api import db
from brobank_api.permissions import EndpointPermissions
from brobank_api.statuses import (
    ExternalApplicationStatus,
    TransactionStatus,
    UserStatus,
)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, unique=True)
    accounts = db.relationship("Account", lazy=True)
    status = db.Column(db.Enum(UserStatus), default=UserStatus.Active)

    telegram_id = db.Column(db.Integer, index=True, unique=True)
    first_name = db.Column(db.String(16))
    last_name = db.Column(db.String(16), nullable=True)
    username = db.Column(db.String(16), unique=True, nullable=True)
    photo_url = db.Column(db.String(32))

    created_on = db.Column(db.DateTime, default=datetime.now)


class Account(db.Model):
    __tablename__ = "accounts"
    id = db.Column(db.Integer, primary_key=True)
    money = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    created_on = db.Column(db.DateTime, default=datetime.now)


class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    status = db.Column(db.Enum(TransactionStatus))

    from_account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"))
    to_account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"))

    created_on = db.Column(db.DateTime, default=datetime.now)


class ExternalApplication(UserMixin, db.Model):
    __tablename__ = "external_applications"
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(16), unique=True)
    email = db.Column(db.String(32), unique=True)
    public_name = db.Column(db.String(32))
    description = db.Column(db.String(280))
    ip_whitelist = db.Column(ARRAY(db.String(15)), default=list)

    permissions = db.Column(
        ARRAY(db.Enum(EndpointPermissions)),
        default=lambda _: [
            EndpointPermissions.ExternalApplications,
            EndpointPermissions.Transactions,
        ],
    )
    token_hash = db.Column(db.String(128), index=True)
    status = db.Column(
        db.Enum(ExternalApplicationStatus), default=ExternalApplicationStatus.Active
    )

    token_generated_on = db.Column(db.DateTime)
    created_on = db.Column(db.DateTime, default=datetime.now)

    def update_token(self):
        token = token_hex(64)
        self.token_hash = hmac.new(
            current_app.config.get("SECRET_KEY").encode(), token.encode(), sha256
        ).hexdigest()
        self.token_generated_on = datetime.now()
        return token

    @classmethod
    def get_by_token(cls, token):
        return cls.query.filter_by(
            token_hash=hmac.new(
                current_app.config.get("SECRET_KEY").encode(), token.encode(), sha256
            ).hexdigest()
        ).first()

    def verify_ip(self, ip):
        return ip in self.ip_whitelist if self.ip_whitelist else True

    def has_permission(self, permission):
        return permission in self.permissions
