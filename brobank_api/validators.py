from functools import wraps

from flask import current_app, request
from flask_login import current_user

from brobank_api.exceptions import APIException


def validate_request(schema, *args, **kwargs):
    def decorator(f):
        @wraps(f)
        def decorated_function(*_args, **_kwargs):
            request_data = None

            if request.method == "GET":
                request_data = dict(request.args)
            elif request.method in ("POST", "PUT", "DELETE"):
                request_data = request.json

            current_app.logger.debug(f"Request data: {request_data}")

            result = schema(*args, **kwargs).load(request_data)
            return f(result, *_args, **_kwargs)

        return decorated_function

    return decorator


def validate_response(schema, *args, **kwargs):
    def decorator(f):
        @wraps(f)
        def decorated_function(*_args, **_kwargs):
            response_data = schema(*args, **kwargs).dump(f(*_args, **_kwargs))
            current_app.logger.debug(f"Response data: {response_data}")
            return response_data

        return decorated_function

    return decorator


def validate_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*_args, **_kwargs):
            if not current_user:
                pass

            if not current_user.has_permission(permission):
                raise APIException(
                    401, "This application has no access to this resource."
                )

            current_app.logger.debug(f"Permission validated: {permission}")

            return f(*_args, **_kwargs)

        return decorated_function

    return decorator
