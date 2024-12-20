# server/app/controllers/call_controller.py
from flask import Blueprint, request, jsonify, g
from app.services.call_service import CallService
from app.repositories.employee_repository import EmployeeRepository
from app.decorators.auth_decorator import jwt_required
from app.services.user_service import UserService

call_bp = Blueprint("call", __name__)
call_service = CallService()
employee_repo = EmployeeRepository()
user_service = UserService()


@call_bp.route("/", methods=["GET"])
@jwt_required(roles=["admin", "accountant"])
def list_calls():
    """
    Возвращает все звонки.
    Доступно только администраторам и бухгалтерам.
    """
    calls = call_service.get_all_calls()
    return jsonify([call.to_dict() for call in calls]), 200


@call_bp.route("/<string:call_id>", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_call(call_id):
    """
    Возвращает звонок по его ID.
    - Администратор и бухгалтер могут просматривать любые звонки.
    - Обычный пользователь может просматривать только свои звонки.
    """
    call = call_service.get_call_by_id(call_id)
    if not call:
        return jsonify({"error": "Call not found"}), 404

    # Проверка для пользователя
    if g.user_role == "user" and call.employee_id != g.employee_id:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(call.to_dict()), 200


@call_bp.route("/employee/<int:employee_id>", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_calls_by_employee(employee_id):
    """
    Возвращает все звонки для заданного employee_id.
    - Администратор и бухгалтер могут просматривать звонки любого сотрудника.
    - Обычный пользователь может просматривать только свои звонки.
    """
    # Получаем текущий user_id из токена
    current_user_id = g.user_id

    # Получаем employee_id через UserService
    current_employee_id = user_service.get_employee_id_by_user_id(current_user_id)

    # Проверяем доступ для обычного пользователя
    if g.user_role == "user" and current_employee_id != employee_id:
        return jsonify({"error": "Forbidden"}), 403

    # Получаем звонки
    calls = call_service.get_calls_by_employee_id(employee_id)
    if not calls:
        return jsonify({"message": "No calls found for this employee"}), 404
    return jsonify({"calls": calls}), 200



@call_bp.route("/", methods=["POST"])
@jwt_required(roles=["admin"])
def create_call():
    """
    Создает новый звонок.
    Доступно только администраторам.
    """
    data = request.get_json()
    new_call = call_service.create_call(data)
    return jsonify(new_call.to_dict()), 201


@call_bp.route("/<string:call_id>", methods=["PUT"])
@jwt_required(roles=["admin"])
def update_call(call_id):
    """
    Обновляет существующий звонок.
    Доступно только администраторам.
    """
    data = request.get_json()
    updated_call = call_service.update_call(call_id, data)
    if updated_call:
        return jsonify(updated_call.to_dict()), 200
    return jsonify({"error": "Call not found"}), 404


@call_bp.route("/populate", methods=["POST"])
@jwt_required(roles=["admin"])
def populate_calls():
    """
    Генерирует случайные звонки для всех абонентов.
    Доступно только администраторам.
    """
    # Достаем ID всех сотрудников
    employees = employee_repo.find_all()
    employee_ids = [employee.employee_id for employee in employees]

    # Запускаем генерацию звонков
    generated_calls = call_service.populate_calls(employee_ids)
    return (
        jsonify(
            {
                "message": "Calls populated successfully",
                "total_calls": len(generated_calls),
            }
        ),
        201,
    )


@call_bp.route("/<string:call_id>", methods=["DELETE"])
@jwt_required(roles=["admin"])
def delete_call(call_id):
    """
    Удаляет звонок по его ID.
    Доступно только администраторам.
    """
    success = call_service.delete_call(call_id)
    if success:
        return jsonify({"status": "Call deleted"}), 200
    return jsonify({"error": "Call not found"}), 404
