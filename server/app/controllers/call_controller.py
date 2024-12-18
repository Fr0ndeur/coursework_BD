# app/controllers/call_controller.py
from flask import Blueprint, request, jsonify
from app.services.call_service import CallService
from app.repositories.employee_repository import EmployeeRepository

call_bp = Blueprint("call", __name__)
call_service = CallService()
employee_repo = EmployeeRepository()


@call_bp.route("/", methods=["GET"])
def list_calls():
    """Возвращает все звонки."""
    calls = call_service.get_all_calls()
    return jsonify([call.to_dict() for call in calls]), 200


@call_bp.route("/<string:call_id>", methods=["GET"])
def get_call(call_id):
    """Возвращает звонок по его ID."""
    call = call_service.get_call_by_id(call_id)
    if call:
        return jsonify(call.to_dict()), 200
    return jsonify({"error": "Call not found"}), 404


@call_bp.route("/employee/<int:employee_id>", methods=["GET"])
def get_calls_by_employee(employee_id):
    """
    Возвращает все звонки для заданного employee_id.
    """
    calls = call_service.get_calls_by_employee_id(employee_id)
    if not calls:
        return jsonify({"message": "No calls found for this employee"}), 404
    return jsonify({"calls": calls}), 200


@call_bp.route("/", methods=["POST"])
def create_call():
    """Создает новый звонок."""
    data = request.get_json()
    new_call = call_service.create_call(data)
    return jsonify(new_call.to_dict()), 201


@call_bp.route("/<string:call_id>", methods=["PUT"])
def update_call(call_id):
    """Обновляет существующий звонок."""
    data = request.get_json()
    updated_call = call_service.update_call(call_id, data)
    if updated_call:
        return jsonify(updated_call.to_dict()), 200
    return jsonify({"error": "Call not found"}), 404


@call_bp.route("/populate", methods=["POST"])
def populate_calls():
    """
    Генерирует случайные звонки для всех абонентов.
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
def delete_call(call_id):
    """Удаляет звонок по его ID."""
    success = call_service.delete_call(call_id)
    if success:
        return jsonify({"status": "Call deleted"}), 200
    return jsonify({"error": "Call not found"}), 404
