# app/controllers/department_controller.py
from flask import Blueprint, request, jsonify
from app.services.department_service import DepartmentService

department_bp = Blueprint("department", __name__)
department_service = DepartmentService()


@department_bp.route("/", methods=["GET"])
def list_departments():
    """Возвращает список всех департаментов."""
    departments = department_service.get_all_departments()
    return jsonify([dept.to_dict() for dept in departments]), 200


@department_bp.route("/<int:department_id>", methods=["GET"])
def get_department(department_id):
    """Возвращает департамент по его ID."""
    department = department_service.get_department_by_id(department_id)
    if department:
        return jsonify(department.to_dict()), 200
    return jsonify({"error": "Department not found"}), 404


@department_bp.route("/", methods=["POST"])
def create_department():
    """Создает новый департамент."""
    data = request.get_json()
    try:
        new_department = department_service.create_department(data)
        return jsonify(new_department.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@department_bp.route("/<int:department_id>", methods=["PUT"])
def update_department(department_id):
    """Обновляет существующий департамент."""
    data = request.get_json()
    updated_department = department_service.update_department(department_id, data)
    if updated_department:
        return jsonify(updated_department.to_dict()), 200
    return jsonify({"error": "Department not found"}), 404


@department_bp.route("/<int:department_id>", methods=["DELETE"])
def delete_department(department_id):
    """Удаляет департамент по его ID."""
    success = department_service.delete_department(department_id)
    if success:
        return jsonify({"status": "Department deleted"}), 200
    return jsonify({"error": "Department not found"}), 404
