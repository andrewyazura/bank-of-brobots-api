class APIException(Exception):
    def __init__(self, code=500, message="API error", *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.code = code
        self.message = message


class InvalidRequestParameter(APIException):
    """Raise if parameter is invalid or requested value doesn't exist"""

    def __init__(self, parameter):
        super().__init__(400, f"{parameter} is invalid.")
