class CustomException(Exception):
    code = 500


class ExternalApplicationForbiddenIP(CustomException):
    """Raise when request IP is not in external application's IP whitelist"""

    code = 403


class ExternalApplicationRestricted(CustomException):
    """Raise when request is from restricted external application"""

    code = 403


class ExternalApplicationNoPermission(CustomException):
    """Raise when external application requests resource it has no permission to"""

    code = 403


class InvalidExternalApplicationToken(CustomException):
    """Raise if external application token is invalid"""

    code = 400


class InvalidTelegramCallbackHash(CustomException):
    """Raise when Telegram callback contains invalid hash"""

    code = 400
