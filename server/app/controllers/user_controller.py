from flask import Blueprint, request, jsonify
from app.services.user_service import UserService

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
def create_user():
    """Создание нового пользователя."""
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
def get_all_users():
    """Получение всех пользователей."""
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
def get_user(user_id):
    """Получение пользователя по его ID."""
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
