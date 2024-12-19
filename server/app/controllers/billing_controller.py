from flask import Blueprint, request, jsonify, g
from app.services.billing_service import BillingService
from app.decorators.auth_decorator import jwt_required

billing_bp = Blueprint("billing", __name__)
billing_service = BillingService()


@billing_bp.route("/", methods=["GET"])
@jwt_required(roles=["admin", "accountant"])
def list_bills():
    """
    Возвращает список всех счетов.
    Доступно только администраторам и бухгалтерам.
    """
    bills = billing_service.get_all_bills()
    return jsonify([bill.to_dict() for bill in bills]), 200


@billing_bp.route("/<int:bill_id>", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_bill(bill_id):
    """
    Возвращает счет по его ID.
    - Администраторы и бухгалтеры могут просматривать любой счёт.
    - Обычные пользователи могут просматривать только свои счета.
    """
    bill = billing_service.get_bill_by_id(bill_id)
    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    # Проверка доступа для обычного пользователя
    if g.user_role == "user" and bill.employee_id != g.employee_id:
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(bill.to_dict()), 200


@billing_bp.route("/employee/<int:employee_id>", methods=["GET"])
@jwt_required(roles=["admin", "accountant", "user"])
def get_bills_by_employee(employee_id):
    """
    Возвращает все счета для заданного employee_id.
    - Администраторы и бухгалтеры могут просматривать счета любого сотрудника.
    - Обычные пользователи могут просматривать только свои счета.
    """
    if g.user_role == "user" and g.employee_id != employee_id:
        return jsonify({"error": "Forbidden"}), 403

    bills = billing_service.get_bills_by_employee_id(employee_id)
    if not bills:
        return jsonify({"message": "No bills found for this employee"}), 404
    return jsonify({"bills": bills}), 200


@billing_bp.route("/", methods=["POST"])
@jwt_required(roles=["admin", "accountant"])
def create_bill():
    """
    Создает новый счет.
    Доступно только администраторам и бухгалтерам.
    """
    data = request.get_json()
    new_bill = billing_service.create_bill(data)
    return jsonify(new_bill.to_dict()), 201


@billing_bp.route("/monthly-report", methods=["POST"])
@jwt_required(roles=["admin", "accountant", "user"])
def generate_monthly_report():
    """
    Генерирует отчёт по звонкам для сотрудника за указанный месяц.
    - Администраторы и бухгалтеры могут генерировать отчёты для любого сотрудника.
    - Обычные пользователи могут генерировать отчёты только для себя.
    Пример body запроса:
    {
        "employee_id": 5,
        "month_year": "2024-12"
    }
    """
    data = request.get_json()
    if not data or "employee_id" not in data or "month_year" not in data:
        return jsonify({"error": "employee_id and month_year are required"}), 400

    # Проверка доступа для пользователя
    if g.user_role == "user" and g.employee_id != data["employee_id"]:
        return jsonify({"error": "Forbidden"}), 403

    response = billing_service.generate_monthly_report(
        data["employee_id"], data["month_year"]
    )
    return jsonify(response), 200


@billing_bp.route("/<int:bill_id>", methods=["PUT"])
@jwt_required(roles=["admin"])
def update_bill(bill_id):
    """
    Обновляет существующий счет.
    Доступно только администраторам.
    """
    data = request.get_json()
    updated_bill = billing_service.update_bill(bill_id, data)
    if updated_bill:
        return jsonify(updated_bill.to_dict()), 200
    return jsonify({"error": "Bill not found"}), 404


@billing_bp.route("/<int:bill_id>", methods=["DELETE"])
@jwt_required(roles=["admin"])
def delete_bill(bill_id):
    """
    Удаляет счет по его ID.
    Доступно только администраторам.
    """
    success = billing_service.delete_bill(bill_id)
    if success:
        return jsonify({"status": "Bill deleted"}), 200
    return jsonify({"error": "Bill not found"}), 404


@billing_bp.route("/pay/<int:bill_id>", methods=["POST"])
@jwt_required(roles=["admin", "accountant", "user"])
def pay_bill(bill_id):
    """
    Оплачивает счет.
    - Администраторы и бухгалтеры могут оплачивать любые счета.
    - Обычные пользователи могут оплачивать только свои счета.
    """
    bill = billing_service.get_bill_by_id(bill_id)
    if not bill:
        return jsonify({"error": "Bill not found"}), 404

    # Проверка доступа для обычных пользователей
    if g.user_role == "user" and bill.employee_id != g.employee_id:
        return jsonify({"error": "Forbidden"}), 403

    # Оплачиваем счёт
    try:
        updated_bill = billing_service.pay_bill(bill_id)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if not updated_bill:
        return jsonify({"error": "Unable to pay bill"}), 500

    return jsonify(updated_bill.to_dict()), 200
