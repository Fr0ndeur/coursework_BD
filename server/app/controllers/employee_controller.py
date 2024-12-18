# app/controllers/employee_controller.py
from flask import Blueprint, request, jsonify
from app.services.employee_service import EmployeeService

employee_bp = Blueprint("employee", __name__)
employee_service = EmployeeService()


@employee_bp.route("/", methods=["GET"])
def list_employees():
    """Возвращает список всех сотрудников."""
    employees = employee_service.get_all_employees()
    return jsonify([emp.to_dict() for emp in employees]), 200


@employee_bp.route("/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):
    """Возвращает сотрудника по его ID."""
    employee = employee_service.get_employee_by_id(employee_id)
    if employee:
        return jsonify(employee.to_dict()), 200
    return jsonify({"error": "Employee not found"}), 404


@employee_bp.route("/", methods=["POST"])
def create_employee():
    """Создает нового сотрудника."""
    data = request.get_json()
    try:
        new_employee = employee_service.create_employee(data)
        return jsonify(new_employee.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@employee_bp.route("/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):
    """Обновляет данные сотрудника."""
    data = request.get_json()
    updated_employee = employee_service.update_employee(employee_id, data)
    if updated_employee:
        return jsonify(updated_employee.to_dict()), 200
    return jsonify({"error": "Employee not found"}), 404


@employee_bp.route("/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    """Удаляет сотрудника по ID."""
    success = employee_service.delete_employee(employee_id)
    if success:
        return jsonify({"status": "Employee deleted"}), 200
    return jsonify({"error": "Employee not found"}), 404
