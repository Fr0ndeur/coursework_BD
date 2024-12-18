from flask import Blueprint, request, jsonify, g
from app.services.employee_service import EmployeeService
from app.services.user_service import UserService
from app.decorators.auth_decorator import jwt_required

employee_bp = Blueprint("employee", __name__)
employee_service = EmployeeService()
user_service = UserService()


@employee_bp.route("/", methods=["GET"])
@jwt_required(roles=["admin", "accountant"])
def list_employees():
    """Возвращает список всех сотрудников (только для admin и accountant)."""
    employees = employee_service.get_all_employees()
    return jsonify([emp.to_dict() for emp in employees]), 200


@employee_bp.route("/<int:employee_id>", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_employee(employee_id):
    """
    Возвращает данные сотрудника по его ID.
    Пользователь с ролью 'user' может получить только свои данные.
    """
    if g.user_role == "user":
        # Проверяем, что user запрашивает только свои данные
        user_employee_id = user_service.get_employee_id_by_user_id(g.user_id)
        if not user_employee_id or user_employee_id != employee_id:
            return jsonify({"error": "Forbidden"}), 403

    # Для admin и accountant возвращаем любые данные
    employee = employee_service.get_employee_by_id(employee_id)
    if employee:
        return jsonify(employee.to_dict()), 200
    return jsonify({"error": "Employee not found"}), 404


@employee_bp.route("/me", methods=["GET"])
@jwt_required(roles=["user"])
def get_my_employee():
    """Возвращает данные текущего пользователя (роль 'user')."""
    user_employee_id = user_service.get_employee_id_by_user_id(g.user_id)
    if not user_employee_id:
        return jsonify({"error": "Employee profile not found"}), 404

    employee = employee_service.get_employee_by_id(user_employee_id)
    if employee:
        return jsonify(employee.to_dict()), 200
    return jsonify({"error": "Employee not found"}), 404


@employee_bp.route("/", methods=["POST"])
@jwt_required(roles=["admin"])
def create_employee():
    """Создаёт нового сотрудника (только для admin)."""
    data = request.get_json()
    try:
        new_employee = employee_service.create_employee(data)
        return jsonify(new_employee.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@employee_bp.route("/<int:employee_id>", methods=["PUT"])
@jwt_required(roles=["admin"])
def update_employee(employee_id):
    """Обновляет данные сотрудника (только для admin)."""
    data = request.get_json()
    updated_employee = employee_service.update_employee(employee_id, data)
    if updated_employee:
        return jsonify(updated_employee.to_dict()), 200
    return jsonify({"error": "Employee not found"}), 404


@employee_bp.route("/<int:employee_id>", methods=["DELETE"])
@jwt_required(roles=["admin"])
def delete_employee(employee_id):
    """Удаляет сотрудника по его ID (только для admin)."""
    success = employee_service.delete_employee(employee_id)
    if success:
        return jsonify({"status": "Employee deleted"}), 200
    return jsonify({"error": "Employee not found"}), 404
