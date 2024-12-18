# app/controllers/user_controller.py
from flask import Blueprint, request, jsonify, g
from app.services.user_service import UserService
from app.decorators.auth_decorator import jwt_required

user_bp = Blueprint("users", __name__)
user_service = UserService()


@user_bp.route("/login", methods=["POST"])
def login():
    """Авторизация пользователя."""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    auth_response = user_service.authenticate_user(username, password)
    if not auth_response:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify(auth_response), 200


@user_bp.route("/", methods=["POST"])
@jwt_required(roles=["admin"])
def create_user():
    """
    Создание нового пользователя.
    Доступно только для администраторов.
    """
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")
    employee_id = data.get("employee_id")

    if not all([username, password, role]):
        return jsonify({"error": "Username, password, and role are required"}), 400

    user_id = user_service.create_user(username, password, role, employee_id)
    return jsonify({"user_id": user_id, "message": "User created successfully"}), 201


@user_bp.route("/", methods=["GET"])
@jwt_required(roles=["admin", "accountant"])
def get_all_users():
    """
    Получение всех пользователей.
    Доступно только для администраторов и бухгалтеров.
    """
    users = user_service.get_all_users()
    return (
        jsonify(
            [
                {
                    "user_id": user.user_id,
                    "username": user.username,
                    "role": user.role,
                    "employee_id": user.employee_id,
                }
                for user in users
            ]
        ),
        200,
    )


@user_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_user(user_id):
    """
    Получение пользователя по его ID.
    - admin и accountant могут получать информацию о любом пользователе.
    - user может получить информацию только о себе.
    """
    # Если роль "user", проверяем соответствие user_id
    if g.user_role == "user" and g.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    user = user_service.get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return (
        jsonify(
            {
                "user_id": user.user_id,
                "username": user.username,
                "role": user.role,
                "employee_id": user.employee_id,
            }
        ),
        200,
    )
