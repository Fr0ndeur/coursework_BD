# app/controllers/billing_controller.py
from flask import Blueprint, request, jsonify
from app.services.billing_service import BillingService

billing_bp = Blueprint("billing", __name__)
billing_service = BillingService()


@billing_bp.route("/", methods=["GET"])
def list_bills():
    """Возвращает список всех счетов."""
    bills = billing_service.get_all_bills()
    return jsonify([bill.to_dict() for bill in bills]), 200


@billing_bp.route("/<int:bill_id>", methods=["GET"])
def get_bill(bill_id):
    """Возвращает счет по его ID."""
    bill = billing_service.get_bill_by_id(bill_id)
    if bill:
        return jsonify(bill.to_dict()), 200
    return jsonify({"error": "Bill not found"}), 404


@billing_bp.route("/employee/<int:employee_id>", methods=["GET"])
def get_bills_by_employee(employee_id):
    """
    Возвращает все счета для заданного employee_id.
    """
    bills = billing_service.get_bills_by_employee_id(employee_id)
    if not bills:
        return jsonify({"message": "No bills found for this employee"}), 404
    return jsonify({"bills": bills}), 200


@billing_bp.route("/", methods=["POST"])
def create_bill():
    """Создает новый счет."""
    data = request.get_json()
    new_bill = billing_service.create_bill(data)
    return jsonify(new_bill.to_dict()), 201


@billing_bp.route("/monthly-report", methods=["POST"])
def generate_monthly_report():
    """
    Генерирует отчёт по звонкам для сотрудника за указанный месяц.
    Пример body запроса:
    {
        "employee_id": 5,
        "month_year": "2024-12"
    }
    """
    data = request.get_json()
    if not data or "employee_id" not in data or "month_year" not in data:
        return jsonify({"error": "employee_id and month_year are required"}), 400

    response = billing_service.generate_monthly_report(
        data["employee_id"], data["month_year"]
    )
    return jsonify(response), 200


@billing_bp.route("/<int:bill_id>", methods=["PUT"])
def update_bill(bill_id):
    """Обновляет существующий счет."""
    data = request.get_json()
    updated_bill = billing_service.update_bill(bill_id, data)
    if updated_bill:
        return jsonify(updated_bill.to_dict()), 200
    return jsonify({"error": "Bill not found"}), 404


@billing_bp.route("/<int:bill_id>", methods=["DELETE"])
def delete_bill(bill_id):
    """Удаляет счет по его ID."""
    success = billing_service.delete_bill(bill_id)
    if success:
        return jsonify({"status": "Bill deleted"}), 200
    return jsonify({"error": "Bill not found"}), 404
