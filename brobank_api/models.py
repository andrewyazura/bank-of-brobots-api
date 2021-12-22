import hmac
import uuid
from datetime import datetime
from hashlib import sha256
from secrets import token_hex

from flask import current_app
from flask_login import UserMixin
from sqlalchemy.dialects import postgresql

from brobank_api import db
from brobank_api.enums import (
    EndpointPermissions,
    ExternalApplicationStatus,
    TransactionStatus,
    UserStatus,
)


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    accounts = db.relationship("Account")
    status = db.Column(postgresql.ENUM(UserStatus), default=UserStatus.Active)

    telegram_id = db.Column(db.Integer, index=True, unique=True)
    first_name = db.Column(db.String(16))
    last_name = db.Column(db.String(16), nullable=True)
    username = db.Column(db.String(16), unique=True, nullable=True)
    photo_url = db.Column(db.String(128))

    created_on = db.Column(db.DateTime, default=datetime.now)


class Account(db.Model):
    __tablename__ = "accounts"
    id = db.Column(postgresql.UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    money = db.Column(db.Float, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    user = db.relationship("User", back_populates="accounts")

    created_on = db.Column(db.DateTime, default=datetime.now)


class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)
    status = db.Column(
        postgresql.ENUM(TransactionStatus), default=TransactionStatus.Created
    )

    from_account = db.Column(
        postgresql.UUID(as_uuid=True), db.ForeignKey("accounts.id")
    )
    to_account = db.Column(postgresql.UUID(as_uuid=True), db.ForeignKey("accounts.id"))

    created_on = db.Column(db.DateTime, default=datetime.now)
    confirmed_on = db.Column(db.DateTime)
    application = db.Column(db.Integer, db.ForeignKey("external_applications.id"))


class ExternalApplication(UserMixin, db.Model):
    __tablename__ = "external_applications"
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(16), unique=True)
    email = db.Column(db.String(32), unique=True)
    public_name = db.Column(db.String(32))
    description = db.Column(db.String(280))
    ip_whitelist = db.Column(postgresql.ARRAY(db.String(15)), default=list)

    permissions = db.Column(
        postgresql.ARRAY(postgresql.ENUM(EndpointPermissions)),
        default=lambda _: [
            EndpointPermissions.ExternalApplications,
            EndpointPermissions.Transactions,
        ],
    )
    token_hash = db.Column(db.String(128), index=True)
    status = db.Column(
        postgresql.ENUM(ExternalApplicationStatus),
        default=ExternalApplicationStatus.Active,
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
