class CustomException(Exception):
    code = 500


class AccountHasNotEnoughMoney(CustomException):
    """Raise if sender account has not enough money for transaction"""

    code = 400
    message = "Sender account has not enough money for the transaction."


class ExternalApplicationForbiddenIP(CustomException):
    """Raise when request IP is not in external application's IP whitelist"""

    code = 403
    message = "IP is not allowed."


class ExternalApplicationRestricted(CustomException):
    """Raise when request is from restricted external application"""

    code = 403
    message = "Application is restricted."


class ExternalApplicationNoPermission(CustomException):
    """Raise when external application requests resource it has no permission to"""

    code = 403
    message = "You don't have permission to access this resource."


class InvalidExternalApplicationToken(CustomException):
    """Raise if external application token is invalid"""

    code = 400
    message = "Bearer token is invalid."


class InvalidTelegramCallbackHash(CustomException):
    """Raise when Telegram callback contains invalid hash"""

    code = 400
    message = "Invalid callback hash."


class InvalidRequestParameter(CustomException):
    """Raise if parameter is invalid or requested value doesn't exist"""

    def __init__(self, parameter):
        super().__init__()
        self.code = 400
        self.message = f"{parameter} is invalid."
