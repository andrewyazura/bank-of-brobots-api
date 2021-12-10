from config import Config
from flask import Flask
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
marshmallow = Marshmallow()
login_manager = LoginManager()


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    marshmallow.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        from brobank_api.api import api_bp
        from brobank_api.errors import errors_bp

        app.register_blueprint(api_bp, url_prefix="/api")
        app.register_blueprint(errors_bp)

        db.create_all()

    return app
