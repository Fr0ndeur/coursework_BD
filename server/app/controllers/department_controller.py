# app/controllers/department_controller.py
from flask import Blueprint, request, jsonify, g
from app.services.department_service import DepartmentService
from app.decorators.auth_decorator import jwt_required

department_bp = Blueprint("department", __name__)
department_service = DepartmentService()


@department_bp.route("/", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def list_departments():
    """
    Возвращает список всех департаментов.
    Доступно всем авторизованным пользователям.
    """
    departments = department_service.get_all_departments()
    return jsonify([dept.to_dict() for dept in departments]), 200


@department_bp.route("/<int:department_id>", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_department(department_id):
    """
    Возвращает департамент по его ID.
    Доступно всем авторизованным пользователям.
    """
    department = department_service.get_department_by_id(department_id)
    if department:
        return jsonify(department.to_dict()), 200
    return jsonify({"error": "Department not found"}), 404


@department_bp.route("/", methods=["POST"])
@jwt_required(roles=["admin"])
def create_department():
    """
    Создает новый департамент.
    Доступно только для администраторов.
    """
    data = request.get_json()
    try:
        new_department = department_service.create_department(data)
        return jsonify(new_department.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@department_bp.route("/<int:department_id>", methods=["PUT"])
@jwt_required(roles=["admin"])
def update_department(department_id):
    """
    Обновляет существующий департамент.
    Доступно только для администраторов.
    """
    data = request.get_json()
    updated_department = department_service.update_department(department_id, data)
    if updated_department:
        return jsonify(updated_department.to_dict()), 200
    return jsonify({"error": "Department not found"}), 404


@department_bp.route("/<int:department_id>", methods=["DELETE"])
@jwt_required(roles=["admin"])
def delete_department(department_id):
    """
    Удаляет департамент по его ID.
    Доступно только для администраторов.
    """
    success = department_service.delete_department(department_id)
    if success:
        return jsonify({"status": "Department deleted"}), 200
    return jsonify({"error": "Department not found"}), 404
