from logging.config import dictConfig

from flask import Flask
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from config import Config, db_metadata

db = SQLAlchemy(metadata=db_metadata)
migrate = Migrate()
marshmallow = Marshmallow()
login_manager = LoginManager()


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)
    dictConfig(config_class.LOG_CONFIG)

    db.init_app(app)
    migrate.init_app(app, db, include_schemas=True)
    marshmallow.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        from brobank_api.api import api_bp

        app.register_blueprint(api_bp)

    return app
