from functools import wraps

from flask import request
from flask_login import current_user

from brobank_api.exceptions import ExternalApplicationNoPermission


def validate_request(schema, *args, **kwargs):
    def decorator(f):
        @wraps(f)
        def decorated_function(*_args, **_kwargs):
            request_data = None

            if request.method == "GET":
                request_data = dict(request.args)
            elif request.method in ("POST", "PUT", "DELETE"):
                request_data = request.json

            result = schema(*args, **kwargs).load(request_data)
            return f(result, *_args, **_kwargs)

        return decorated_function

    return decorator


def validate_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*_args, **_kwargs):
            if not current_user:
                pass

            if not current_user.has_permission(permission):
                raise ExternalApplicationNoPermission(
                    "This application has no access to this resource."
                )

            return f(*_args, **_kwargs)

        return decorated_function

    return decorator
