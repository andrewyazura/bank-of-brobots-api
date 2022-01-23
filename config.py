import os

from dotenv import load_dotenv
from sqlalchemy import MetaData

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"), override=True)

db_metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)


def get_env_group(prefix):
    return {k[len(prefix) :]: v for k, v in os.environ.items() if k.startswith(prefix)}


LOG_CONFIG = get_env_group("LOG_")


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    TELEGRAM_BOT = get_env_group("TELEGRAM_BOT_")

    LOG_CONFIG = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "file": {
                "format": LOG_CONFIG.get("FORMAT"),
                "datefmt": LOG_CONFIG.get("DATEFMT"),
            }
        },
        "handlers": {
            "file": {
                "level": LOG_CONFIG.get("LEVEL"),
                "formatter": "file",
                "class": "logging.handlers.TimedRotatingFileHandler",
                "filename": LOG_CONFIG.get("FILENAME"),
                "when": "midnight",
                "backupCount": int(LOG_CONFIG.get("BACKUP_COUNT")),
                "utc": True,
            }
        },
        "loggers": {
            "werkzeug": {"level": "WARNING", "handlers": ["file"]},
            "sqlalchemy": {"level": "WARNING", "handlers": ["file"]},
        },
        "root": {"level": LOG_CONFIG.get("LEVEL"), "handlers": ["file"]},
    }

    CALLBACK_HEADERS = {"User-Agent": os.environ.get("USER_AGENT")}
