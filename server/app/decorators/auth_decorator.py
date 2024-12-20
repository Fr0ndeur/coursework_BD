# server/app/decorators/auth_decorator.py
from functools import wraps
from flask import request, jsonify, g
import jwt
from datetime import datetime

# Секретный ключ для подписи JWT
SECRET_KEY = "your_secret_key"


def jwt_required(roles=None):
    """
    Декоратор для проверки JWT токена и ролей пользователя.

    :param roles: Список разрешённых ролей (например, ["admin", "accountant"])
    """
    if roles is None:
        roles = []

    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # Попытка извлечь токен из заголовка Authorization
            token = None
            auth_header = request.headers.get("Authorization", None)
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

            # Если токен отсутствует в заголовке, пробуем извлечь его из куки
            if not token:
                token = request.cookies.get("access_token")
                if not token:
                    return jsonify({"error": "Missing or invalid token"}), 401

            try:
                # Декодируем токен
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                role = payload.get("role")
                exp = payload.get("exp")

                # Проверяем срок действия токена
                if datetime.utcnow() > datetime.utcfromtimestamp(exp):
                    return jsonify({"error": "Token has expired"}), 401

                # Проверяем роль пользователя
                if roles and role not in roles:
                    return (
                        jsonify({"error": "Forbidden. Insufficient permissions."}),
                        403,
                    )

                # Сохраняем данные пользователя в глобальный контекст Flask
                g.user_id = user_id
                g.user_role = role

            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token"}), 401

            return f(*args, **kwargs)

        return wrapper

    return decorator
